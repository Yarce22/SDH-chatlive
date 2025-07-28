const privateRoomChat = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  return `private-${sortedIds.join("-")}`;
}

export default privateRoomChat