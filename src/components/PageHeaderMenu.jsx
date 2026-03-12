"use client";

import React, { useState, useEffect, useRef } from "react";

const PageHeaderMenu = () => {
  const dataList = [
    {
      title: "Cruz",
      video: "/videos/CRUZ.mp4",
      isReleased: true,
      url: "https://www.behance.net/gallery/190233805/Cruz-Online-bank",
    },
    {
      title: "NVO",
      video: "/videos/NVO.mp4",
      isReleased: true,
      url: "https://www.behance.net/gallery/243026981/NVO-High-Performance-Trading-Platform",
    },
    {
      title: "Vodafone",
      video: "/videos/Vodafone.mp4",
      isReleased: true,
      url: "https://www.behance.net/gallery/217578993/Vodafone-Telecom-Digital-Platform",
    },
    {
      title: "Nobleblocks",
      video: "/videos/Nobleblocks.mp4",
      isReleased: true,
      url: "https://www.behance.net/gallery/237005055/Nobleblocks-Blockchain-Scientific-Publishing-Platform",
    },
    {
      title: "ApeAi",
      video: "/videos/ApeAi.mp4",
      isReleased: true,
    },
    {
      title: "Velas",
      video: "/videos/Velas.mp4",
      isReleased: true,
      url: "https://www.behance.net/gallery/219771415/Velas-UIUX-Digital-System",
    },
    {
      title: "Tama",
      video: "/videos/Tama.mp4",
      isReleased: true,
    },
    {
      title: "Looksrare",
      video: "/videos/Looksrare.mp4",
      isReleased: true,
      url: "https://www.behance.net/gallery/192663151/Looksrare-NFT-Marketplace-UIUX",
    },
    {
      title: "Bobaswap",
      video: "/videos/Bobaswap.mp4",
      isReleased: true,
    },
    {
      title: "Pancakeswap",
      video: "/videos/Pancakeswap.mp4",
      isReleased: true,
      url: "https://www.behance.net/gallery/216199981/Pancakeswap-Web3-Wallet",
    },
    {
      title: "Freedom Finance",
      video: "/videos/FreedomFinance.mp4",
      isReleased: true,
      url: "https://www.behance.net/gallery/244498901/Freedom-Finance-Bank-Card-Series",
    },
    {
      title: "Polkadot",
      video: "/videos/Polkadot.mp4",
      isReleased: true,
    },
    {
      title: "Eclipse",
      video: "/videos/Eclipse.mp4",
      isReleased: true,
    },
    { title: "AMC+", isReleased: false },
    { title: "Huawei", isReleased: false },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const videoRef = useRef(null);
  const preloadedRefs = useRef({});

  const activeItem = dataList[activeIndex];

  // Проверяем размер экрана
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1025);

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  // preload видео (только desktop)
  const preloadVideo = (index) => {
    if (!isDesktop) return;

    if (index < 0 || index >= dataList.length) return;
    const item = dataList[index];

    if (!item.isReleased || !item.video) return;

    if (!preloadedRefs.current[item.title]) {
      const vid = document.createElement("video");

      vid.src = item.video;
      vid.preload = "auto";
      vid.muted = true;
      vid.playsInline = true;
      vid.style.display = "none";

      document.body.appendChild(vid);

      preloadedRefs.current[item.title] = vid;
    }
  };

  // preload соседних
  useEffect(() => {
    if (!isDesktop) return;

    preloadVideo(activeIndex);
    preloadVideo(activeIndex - 1);
    preloadVideo(activeIndex + 1);
  }, [activeIndex, isDesktop]);

  // переключение видео
  useEffect(() => {
    if (!isDesktop) return;

    if (videoRef.current && activeItem.video) {
      videoRef.current.src = activeItem.video;
      videoRef.current.load();
    }
  }, [activeItem.video, isDesktop]);

  const handleMouseEnter = (index) => {
    if (dataList[index].isReleased) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="page-menu">
      <ul className="page-menu__list">
        {dataList.map((item, index) => {
          const { title, isReleased, url } = item;

          return (
            <li
              key={title}
              className={`page-menu__item ${
                index === activeIndex ? "active" : ""
              } ${!isReleased ? "page-menu__item--disabled" : ""}`}
              onMouseEnter={() => handleMouseEnter(index)}
            >
              {url ? (
                <a href={url} target="_blank">
                  {title}
                </a>
              ) : (
                title
              )}
            </li>
          );
        })}
      </ul>

      <div className="page-menu__video-wrapper">
        {isDesktop && activeItem.isReleased && (
          <video ref={videoRef} muted playsInline autoPlay loop />
        )}
      </div>
    </div>
  );
};

export default PageHeaderMenu;
