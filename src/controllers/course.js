exports.index = (req, res) => {
  const result = [
    {
      name: "Hello Troth",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
      cover: "https://reactstrap.github.io/assets/318x180.svg",
      course: 2,
      teacher: 23,
      created: new Date(),
    },
  ];
  res.json({ status: true, result });
};
exports.create_category = (req, res) => {
  res.json({ status: true });
};
