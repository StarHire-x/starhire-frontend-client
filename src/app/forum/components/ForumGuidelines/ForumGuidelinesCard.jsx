"use client";

import { Card } from "primereact/card";
import styles from './ForumGuidelinesCard.module.css';

const ForumGuidelinesCard = () => {
  const forumGuideLines =
    "StarHireWhisper was created to give people a voice and share their interesting content.\n\n\n StarHireWhisper is not affiliated with the StarHire.\n\n DISCLAIMER\n\nWe are unable to authenticate the validity of confessions due to its anonymous nature. Readers are advised to not take the confessions too seriously. \n\nREPORT CONTENT\n\n We might accidentally approve confessions that might be insulting or uncomfortable to some (we are humans too). If you have spotted such confessions, feel free to message us or drop us an e-mail at admin@starhire.sg\n\n Confession's ID that are posted may not be in sequence.\n\nCOMMENTS\n\n Be nice, civil and polite. Do not start a flame war. Personal attacks are not tolerated.";
  return (
    <>
    <Card className={styles.forumGuideLinesCard} title="Forum Guidelines">
        <p>{forumGuideLines}</p>
    </Card>
    </>
  )
};

export default ForumGuidelinesCard;
