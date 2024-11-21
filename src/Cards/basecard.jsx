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

export default BaseCard