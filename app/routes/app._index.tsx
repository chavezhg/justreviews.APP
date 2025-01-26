import { useLoaderData } from "@remix-run/react";
import style from "../styles/index.module.css";
import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return new Response(
    JSON.stringify({
      apiURL: process.env.VITE_API_URL || process.env.API_URL,
      shopifyApiKey: process.env.SHOPIFY_API_KEY,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export default function Index() {
  // Obtén los datos del loader
  const { apiURL } = useLoaderData<typeof loader>();

  return (
    <div className={style.container}>
      <div className={style.discountBanner}>
        Obtén nuestra nueva aplicación con esta oferta. 10.99 USD / mes {import.meta.env.VITE_API_URL}
      </div>

      <header>
        How soft is the fabric?
        <p>Tailor questions for each product collection and showcase reviews that highlight selling points.</p>
        <button className={style.btn}>Get started</button>
      </header>

      <div className={style.cardsContainer}>
        <div className={style.checklist}>
          <h3>Complete your setup</h3>
          <ul>
            <li className={style.completed}>
              <span className={style.icon}>&#10004;</span>
              <span className={style.text}>Install app</span>
            </li>
            <li className={style.completed}>
              <span className={style.icon}>&#10004;</span>
              <span className={style.text}>Send requests to past customers (Skipped)</span>
            </li>
            <li className={style.completed}>
              <span className={style.icon}>&#10004;</span>
              <span className={style.text}>Configure your settings</span>
            </li>
            <li className={style.incomplete}>
              <span className={style.icon}>&#9675;</span>
              <span className={style.text}>Rate your experience</span>
              <span className={style.arrow}>&#x2794;</span>
            </li>
          </ul>
        </div>

        <div className={style.promoCard}>
          <h3>Try Our New Widget!</h3>
          <p>Enhance your reviews with our latest widget. Click below to learn more.</p>
          <img src="https://placehold.co/300" alt="Widget Promo" />
        </div>
      </div>

      <div className={style.stats}>
        <div className={style.statItem}>
          <h4>Total Reviews</h4>
          <p id="total-reviews">0</p>
        </div>
        <div className={style.statItem}>
          <h4>Photo Reviews</h4>
          <p id="photo-reviews">0</p>
        </div>
        <div className={style.statItem}>
          <h4>Review Requests</h4>
          <p id="review-requests">0</p>
        </div>
      </div>
    </div>
  );
}
