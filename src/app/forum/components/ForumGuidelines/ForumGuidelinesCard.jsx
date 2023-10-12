"use client";

import { Card } from "primereact/card";
import styles from "./ForumGuidelinesCard.module.css";

const ForumGuidelinesCard = ({
  forumCategoryTitle,
  forumGuideLinesByCategory,
}) => {
  const forumGuideLinesArr = forumGuideLinesByCategory?.split("~");

  const forumGuideLines = () => {
    return (
      <>
        {(forumCategoryTitle === "My Posts" ||
          forumCategoryTitle === "Recent Posts" ? (
            <>
              <p>
                StarHireWhisper was created to give people a voice and share
                their interesting content.
              </p>
              <br />
              <p>StarHireWhisper is not affiliated with the StarHire.</p>
              <br />
              <p>DISCLAIMER</p>
              <p>
                We are unable to authenticate the validity of confessions due to
                its anonymous nature. Readers are advised to not take the
                confessions too seriously.
              </p>
              <br />
              <p>REPORT CONTENT</p>
              <p>
                We might accidentally approve confessions that might be
                insulting or uncomfortable to some (we are humans too). If you
                have spotted such confessions, feel free to message us or drop
                us an e-mail at admin@starhire.sg
              </p>
              <br />
              <p>Post&apos;s ID that are posted may not be in sequence.</p>
              <br />
              <p>COMMENTS</p>
              <p>
                Be nice, civil and polite. Do not start a flame war. Personal
                attacks are not tolerated.
              </p>
            </>
          ) : (
            <>
              {forumGuideLinesArr.map((data) => (
                <div key={data}>
                  <p>{data}</p> <br />
                </div>
              ))}
            </>
          ))}
      </>
    );
  };
  // "StarHireWhisper was created to give people a voice and share their interesting content.\n\n\n StarHireWhisper is not affiliated with the StarHire.\n\n DISCLAIMER\n\nWe are unable to authenticate the validity of confessions due to its anonymous nature. Readers are advised to not take the confessions too seriously. \n\nREPORT CONTENT\n\n We might accidentally approve confessions that might be insulting or uncomfortable to some (we are humans too). If you have spotted such confessions, feel free to message us or drop us an e-mail at admin@starhire.sg\n\n Confession's ID that are posted may not be in sequence.\n\nCOMMENTS\n\n Be nice, civil and polite. Do not start a flame war. Personal attacks are not tolerated.";
  return (
    <>
      <Card className={styles.forumGuideLinesCard} title="Forum Guidelines">
        {forumGuideLines()}
      </Card>
    </>
  );
};

export default ForumGuidelinesCard;
