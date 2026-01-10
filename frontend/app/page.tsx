"use client";

import Footer from "./components/footer";
import NavBar from "./components/nav-bar";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Homepage() {
  const images = [
    "/headphone.jpg",
    "/camera.jpg",
    "/shirt.jpg",
    "/pant.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <NavBar />
      <main>
        <section className="hero min-h-screen bg-white">
          <div className="hero-content flex-col lg:flex-row-reverse gap-10">
            <div className="max-w-sm rounded-lg shadow-2xl overflow-hidden">
              <img
                src={images[currentIndex]}
                className="w-[500px] h-[400px] object-cover transition-all duration-700 ease-in-out"
                alt="Shopping illustration"
              />
            </div>
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
