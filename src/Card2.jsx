function Card2(ip){
  return(
    <div className="card2">
      <img className="profileimg" src="https://www.zoologiste.com/images/main/lion.jpg" alt="profile picture"></img>
      <h2 className="profiletitle">{ip.name}</h2>
      <p className="profileinfo1">{ip.para}</p>
      <p className="profileinfo1">{ip.time}</p>
      <p className="profileinfo1">{ip.stu ? "Yes" : "No"}</p>
    </div>
  );
}

export default Card2