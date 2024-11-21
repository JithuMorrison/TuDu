import Button from "./Button/Button";

function Card2(ip){
  return(
    <div className="card2">
      <img className="profileimg" src="https://www.zoologiste.com/images/main/lion.jpg" alt="profile picture"></img>
      <h2 className="profiletitle">{ip.name}</h2>
      <p className="profileinfo">{ip.para}</p>
      <p className="profileinfo">{ip.time}</p>
      <p className="profileinfo">{ip.stu ? "Yes" : "No"}</p>
    </div>
  );
}
Card2.defaultProps = {
  name: "Lion",
  para: "Lions are the only cats",
  stu: false,
}

export default Card2