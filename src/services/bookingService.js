// src/services/bookingService.js

/* =========================
   MOCK BOOKINGS DATA
========================= */

let bookings = [
  {
    id: "1",
    listingId: "1",
    listingTitle: "Green View Hostel",
    studentId: "201",
    studentName: "Saman Perera",
    ownerId: "101",
    status: "pending", // pending | approved | rejected
    createdAt: "2025-01-10",
  },
];

/* =========================
   STUDENT ACTIONS
========================= */

export const requestBooking = ({ listingId, studentId, studentName, ownerId }) => {
  const newBooking = {
    id: Date.now().toString(),
    listingId,
    listingTitle: "Boarding Listing",
    studentId,
    studentName,
    ownerId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);

  console.log("Booking request created:", newBooking);
  return { success: true };
};

export const getStudentBookings = (studentId) => {
  return bookings.filter((b) => b.studentId === studentId);
};

/* =========================
   OWNER ACTIONS
========================= */

export const getOwnerRequests = (ownerId) => {
  return bookings.filter(
    (b) => b.ownerId === ownerId && b.status === "pending"
  );
};

export const updateBookingStatus = (bookingId, status) => {
  bookings = bookings.map((b) =>
    b.id === bookingId ? { ...b, status } : b
  );

  console.log(`Booking ${bookingId} updated to ${status}`);
  return { success: true };
};

/* =========================
   ADMIN (OPTIONAL)
========================= */

export const getAllBookings = () => {
  return bookings;
};
