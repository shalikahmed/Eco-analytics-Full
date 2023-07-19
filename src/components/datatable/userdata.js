export const userData = [
    {
      id: 1,
      name: "Shalik Ahmed",
      dob: "1990-01-01",
      gender: "Male",
      fathersName: "Michael Doe",
      address: "123 Main St",
      vtc: "Village",
      po: "Post Office",
      subDistrict: "Sub District",
      district: "District",
      state: "State",
      pincode: "620021",
      mobile: "1234567890",
      members: 4,
      municipality: "Trichy west",
      town : null,
    },
  ];
  export const pincodeData = userData.map((user) => ({
    pincode: user.pincode,
    user: user,
  }));
  