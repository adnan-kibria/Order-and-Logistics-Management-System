"use client";

import Footer from "./components/footer";
import NavBar from "./components/nav-bar";
import Link from "next/link";
import SlideShow from "./components/slideshow";

export default function Homepage() {

  return (
    <>
      <NavBar />
      <main>
        <section className="hero min-h-screen bg-white">
          <div className="hero-content flex-col lg:flex-row-reverse gap-10">
            <SlideShow></SlideShow>
            <div>
              <h1 className="text-5xl font-extrabold leading-tight text-black">
                Welcome to <span className="text-yellow-300">SHOP-ONLINE</span>
              </h1>
              <p className="py-6 text-lg max-w-md text-black">
                Discover amazing products at unbeatable prices. Fast delivery,
                secure checkout, and a seamless shopping experience tailored just for you.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/signup"
                  className="btn btn-warning text-black font-bold"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
