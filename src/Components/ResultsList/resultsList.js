import React from "react";
import * as styles from "./resultsList.module.css";

function ResultsList({ results }) {
    return (
    <ul className={styles.resultsList}>
      {results.map((item) => (
        <li key={item.id} className={styles.resultsListItem}>
          <img className={styles.picture} src={item.picture} alt="travelImg"></img>
          <h2 className={styles.activityName}>
            Activity Name: {item.activity.name}
          </h2>
          <p className={styles.activityPrice}>from ${item.price}.00</p>
          <p className={styles.activityDescr}>{item.activity.description}</p>

          <p className={styles.activityQuantityReviews}>
            {item.quantityReviews} Reviews
          </p>
          {/* <p className={styles.activityRating}>{item.rating}</p> */}
          <div className={styles.wrapper}>
            <p className={styles.activityDuration}>{item.duration} Hours</p>
            {item.freeCansellation ? (
              <p className={styles.activityFreeCansellation}>Free Cansellation</p>
            ) : null}
            {item.takingSafetyMeasures ? (
              <p className={styles.activityTakingSafetyMeasures}>Taking Safety Measures</p>
            ) : null}
          </div>

          <div className={styles.ratingResult}>
            <span className={styles.active}></span>
            <span className={styles.active}></span>
            <span className={styles.active}></span>
            <span></span>
            <span></span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ResultsList;
