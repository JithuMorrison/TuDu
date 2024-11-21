import Card from '../Card';
import styles from './card.module.css';
function BaseCard(hes){
  const cards = hes.cardsdata.filter(card => card.para == "manager");
  const ints = hes.cardsdata.map(card => <Card name={card.name} para={card.para}  stu={card.stu} />);
  return(
    <div className={styles.basecard}>
      <h1>Managers</h1>
      {ints}
    </div>
  );
}
BaseCard.defaultProps = {
  cardsdata: [
    { name: "Jithu", para: "software dev", stu: true },
    { name: "Yk", para: "designer", stu: false },
    { name: "Hello", para: "manager", stu: true },
    { name: "nam", para: "engineer", stu: false }
  ]  
}

export default BaseCard