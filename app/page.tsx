/* Native images keep the supplied challenge assets at their intrinsic sizes. */
/* eslint-disable @next/next/no-img-element */
import { ShareMenu } from "./share-menu";
import { siteName } from "./site";

export default function Home() {
  return (
    <>
      <main>
        <article className="preview-card" aria-labelledby="article-title">
          <img className="preview-image" src="/images/drawers.jpg" width="660" height="528" alt="A green chest of drawers with a vase of dried grass and framed prints against a white brick wall." fetchPriority="high" />
          <div className="preview-body">
            <h1 id="article-title">Shift the overall look and feel by adding these wonderful touches to furniture in your home</h1>
            <p className="excerpt">
              Ever been in a room and felt like something was missing? Perhaps it felt slightly bare and uninviting. I’ve got some simple tips to help you make any room feel complete.
            </p>
            <footer className="preview-footer">
              <div className="author">
                <img src="/images/avatar-michelle.jpg" width="40" height="40" alt="" />
                <p>
                  <span className="author-name">Michelle Appleton</span>
                  <time dateTime="2020-06-28">28 Jun 2020</time>
                </p>
              </div>
              <ShareMenu />
            </footer>
          </div>
        </article>
      </main>
      <footer className="attribution">
        <strong className="site-name">{siteName}</strong>. Challenge by <a href="https://www.frontendmentor.io/challenges/article-preview-component-dYBN_pYFT">Frontend Mentor</a>. Built by <a href="https://royeradames.com">Royer Adames</a>.
      </footer>
    </>
  );
}
