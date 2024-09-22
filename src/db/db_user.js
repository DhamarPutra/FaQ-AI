const db_user = [
  { phone: "6288218213617@c.us", role: "admin" },
  { phone: "628128468374@c.us", role: "member" },
];
function phoneNumber(requiredRole, message) {
  const user = db_user.find((u) => u.phone === message.from);

  if (!user) {
    return false;
  }

  if (user.role !== requiredRole && requiredRole !== "any") {
    return false;
  }

  return true;
}

module.exports = phoneNumber;