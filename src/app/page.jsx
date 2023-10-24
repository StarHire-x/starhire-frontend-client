'use client';
import Image from 'next/image';
import styles from './page.module.css';
import Hero from 'public/hero.png';
import Contact from 'public/contact.png';
import Apps from 'public/apps.jpg';
import Websites from 'public/websites.jpg';
import { Carousel } from 'primereact/carousel';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const session = useSession();

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  // Define carousel data
  const textItems = [
    { content: 'Education Best Talent Marketplace', image: Hero },
    { content: 'Job Search with StarHire', image: Contact },
    { content: 'The Power Of StarHire For Your Company', image: Websites },
    { content: 'What Success Looks Like', image: Apps },
  ];

  const textItemTemplate = (item) => {
    return (
      <div className={styles.carouselSlide}>
        <Image src={item.image} alt="Carousel Image" className={styles.img} />
        <h1>{item.content}</h1>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>The Next StarHire</h1>
        {/* <Image src={Hero} alt="Picture" className={styles.img} /> */}
      </div>
      <div>
        {/* <p className={styles.subTitle}>
          Education&apos;s best talent marketplace
        </p> */}

        <Carousel
          value={textItems}
          itemTemplate={textItemTemplate}
          numVisible={1}
          numScroll={1}
          responsiveOptions={[
            { breakpoint: '1024px', numVisible: 1, numScroll: 1 },
            { breakpoint: '768px', numVisible: 1, numScroll: 1 },
            { breakpoint: '560px', numVisible: 1, numScroll: 1 },
          ]}
          className={styles.carousel}
          autoplayInterval={2500}
          circular={true}
        />
      </div>
      <div>
        {!accessToken && (
          <div className={styles.buttonContainer}>
            <button
              className={styles.jobSearchButton}
              onClick={() => (window.location.href = '/login')}
            >
              Job Search
            </button>

            <button
              className={styles.findTalentButton}
              onClick={() => (window.location.href = '/login')}
            >
              Find Talent
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
