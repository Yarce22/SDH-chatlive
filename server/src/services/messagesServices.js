import { db } from "./firebase-admin.js";

export const getMessages = async (roomId, limit = 20, lastVisible = null) => {
  try {
    const roomQuery = await db.collection('chatRooms')
      .where('roomId', '==', roomId)
      .limit(1)
      .get();

    if (roomQuery.empty) {
      return { messages: [], lastVisible: null };
    }

    const roomDoc = roomQuery.docs[0];
    let query = roomDoc.ref.collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(limit);

    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }

    const messagesSnapshot = await query.get();
    const messages = [];
    
    messagesSnapshot.forEach(doc => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        message: data.message,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp,
        sender: data.sender
      });
    });

    const newLastVisible = messagesSnapshot.docs[messagesSnapshot.docs.length - 1];
    
    return {
      messages: messages.reverse(),
      lastVisible: newLastVisible
    };
  } catch (error) {
    console.error('Error al cargar mensajes:', error);
    throw error;
  }
};

export const subscribeToRoomMessages = (roomId, callback, limit = 20) => {
  const chatRoomQuery = db.collection('chatRooms')
    .where('roomId', '==', roomId)
    .limit(1);

  const unsubscribe = chatRoomQuery.onSnapshot(async (snapshot) => {
    if (snapshot.empty) {
      console.log('No se encontró la sala de chat');
      callback({ messages: [], hasMore: false });
      return;
    }

    const roomDoc = snapshot.docs[0];
    
    const messagesUnsubscribe = roomDoc.ref.collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .onSnapshot((messagesSnapshot) => {
        const messages = [];
        
        messagesSnapshot.forEach(doc => {
          const data = doc.data();
          messages.push({
            id: doc.id,
            message: data.message,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp,
            sender: data.sender
          });
        });
        
        callback({ 
          messages: messages.reverse(),
          hasMore: messages.length >= limit
        });
      }, (error) => {
        console.error('Error en la suscripción a mensajes:', error);
        callback({ messages: [], hasMore: false, error });
      });

    return messagesUnsubscribe;
  }, (error) => {
    console.error('Error en la suscripción a la sala de chat:', error);
    callback({ messages: [], hasMore: false, error });
  });

  return () => {
    unsubscribe();
  };
};

export const sendMessage = async (roomId, message, timestamp, sender) => {
  try {
    const chatRoomsRef = db.collection('chatRooms');
    const roomQuery = await chatRoomsRef.where('roomId', '==', roomId).limit(1).get();

    let roomDoc;
    
    if (roomQuery.empty) {
      const participants = roomId.replace('private-', '').split('-');
      
      const newChatRef = chatRoomsRef.doc();
      await newChatRef.set({
        roomId: roomId,
        type: 'private',
        participants: participants,
        createdAt: new Date(),
        lastActivity: new Date()
      });
      roomDoc = { ref: newChatRef };
    } else {
      roomDoc = roomQuery.docs[0];
    }

    const messageRef = roomDoc.ref.collection('messages').doc();

    const newMessage = {
      message,
      timestamp: new Date(timestamp),
      sender
    };

    await messageRef.set(newMessage);
    await roomDoc.ref.update({ lastActivity: new Date() });

  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    throw error;
  }
}
