const createRoom = (userId1: string, userId2: string) => {
  const sortedIds = [userId1, userId2].sort();
  return `private-${sortedIds.join("-")}`;
}

export default createRoom