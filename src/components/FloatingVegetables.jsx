import "./FloatingVegetables.css";

function FloatingVegetables() {
  const vegetables = [
    {
      img: "/vegetables/carrot.png",
      className: "veg carrot"
    },
    {
      img: "/vegetables/tomato.png",
      className: "veg tomato"
    },
    {
      img: "/vegetables/avocado.png",
      className: "veg avocado"
    },
    {
      img: "/vegetables/cabbage.png",
      className: "veg cabbage"
    },
    {
      img: "/vegetables/cucumber.png",
      className: "veg cucumber"
    }
  ];

  return (
    <>
      {vegetables.map((item, index) => (
        <img
          key={index}
          src={item.img}
          className={item.className}
          alt=""
        />
      ))}
    </>
  );
}

export default FloatingVegetables;