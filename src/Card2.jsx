function Card2(ip){
  return(
    <div className={ip.isMobileView ? "card21" : "card2"}>
      <img className="profileimg" src="https://www.zoologiste.com/images/main/lion.jpg" alt="profile" />
      <div className="card-content">
        <h2 className="profiletitle">{ip.name}</h2>
        <p className="profileinfo2">{ip.para}</p>
        <div className="info-grid">
          <p className="info-item"><span>Time:</span> {ip.time}</p>
          <p className="info-item"><span>Status:</span> {ip.stu ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}

export default Card2