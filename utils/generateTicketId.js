import { v4 as uuidv4 } from 'uuid';

export const generateTicketID = ()=> {

  const uuid = uuidv4();

  const ticketID = `${uuid.slice(-10).toUpperCase()}`;

  return ticketID;
};

// const ticketID = generateTicketID();
// console.log(ticketID); // Output: e.g., "TICKET-4F7D9C3A"
