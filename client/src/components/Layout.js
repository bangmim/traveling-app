import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Search from "./Search";
export default function Layout() {
  const [active, setActive] = useState(false);
  const [activeHome, setActiveHome] = useState(false);

  return (
    <div className="max-w-md mx-auto pt-16 md:max-w-5xl">
      {/* top-nav */}
      <nav className="fixed top-0 left-0 w-full border-b z-10 bg-white ">
        <ul className="block">
         {/*  */}
          <div className="flex mt-5 border-b justify-between mx-4">
            {/* logo */}
            <li className="logo">
              <div className="logo_wrap flex ">
                <div className="icon_wrap self-center">
                  <svg className="w-6 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M144 56c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v72H144V56zm176 72H288V56c0-30.9-25.1-56-56-56H152C121.1 0 96 25.1 96 56v72H64c-35.3 0-64 28.7-64 64V416c0 35.3 28.7 64 64 64c0 17.7 14.3 32 32 32s32-14.3 32-32H256c0 17.7 14.3 32 32 32s32-14.3 32-32c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64zM112 224H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 128H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" /></svg>
                </div>
                <div className="text-wrap ">
                  <span className="text-xl font-bold">Traveling-App</span>
                </div>
              </div>
            </li>
            {/* search */}
            <li className="search w-1/2">
              <Search />
            </li>
            <div className="flex hidden md:flex">
              {/* 위시리스트 */}
              <li className="mr-5">
                <Link to="/favorite" onClick={() => setActive(true) + setActiveHome(false)} className="flex flex-col items-center gap-1 p-2"><svg className={"w-7 " + (active ? "fill-red-500" : "fill-gray-800")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" /></svg></Link>
              </li>
              {/* 로그인 */}
              <li>
                <Link to="/login" className="flex flex-col items-center gap-1 p-2"><svg className="w-6  " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg></Link>
              </li>
            </div>
          </div>

          {/* tab-menu */}
          <li className="menu px-5 mt-2 mx-auto ">
            <ul className="w-full border-b bg-white h-20 inline-flex gap-8 overflow-x-scroll font-bold items-center md:flex justify-between">
              <li className="min-w-fit" >
                <Link to="/hanok" className="flex flex-col items-center gap-1">
                  <img src="https://a0.muscache.com/pictures/51f5cf64-5821-400c-8033-8a10c7787d69.jpg" alt="섬" className="w-8 " />
                  <span className="text-xs">한옥</span>
                </Link>
              </li>
              <li className="min-w-fit" >
                <Link to="/best" className="flex flex-col items-center gap-1">
                  <img src="https://a0.muscache.com/pictures/3726d94b-534a-42b8-bca0-a0304d912260.jpg" alt="인기" className="w-8 " />
                  <span className="text-xs">인기급상승</span>
                </Link>
              </li>
              <li className="min-w-fit" >
                <Link to="/country" className="flex flex-col items-center gap-1">
                  <img src="https://a0.muscache.com/pictures/6ad4bd95-f086-437d-97e3-14d12155ddfe.jpg" alt="시골" className="w-8 " />
                  <span className="text-xs">한적한시골</span>
                </Link>
              </li>
              <li className="min-w-fit" >
                <Link to="/windmill" className="flex flex-col items-center gap-1">
                  <img src="https://a0.muscache.com/pictures/5cdb8451-8f75-4c5f-a17d-33ee228e3db8.jpg" alt="풍차" className="w-8 " />
                  <span className="text-xs">풍차</span>
                </Link>
              </li>
              <li className="min-w-fit" >
                <Link to="/beach" className="flex flex-col items-center gap-1">
                  <img src="https://a0.muscache.com/pictures/bcd1adc0-5cee-4d7a-85ec-f6730b0f8d0c.jpg" alt="해변" className="w-8 " />
                  <span className="text-xs">해변바로앞</span>
                </Link>
              </li>
              <li className="min-w-fit" >
                <Link to="/private" className="flex flex-col items-center gap-1">
                  <img src="https://a0.muscache.com/pictures/eb7ba4c0-ea38-4cbb-9db6-bdcc8baad585.jpg" alt="개인실" className="w-8 " />
                  <span className="text-xs">개인실</span>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* bottom-nav */}
      <nav className="bottom_menu">
        <ul className="flex fixed p-2 bottom-0 left-0 w-full border-t z-10 bg-white justify-between items-center md:hidden">
          {/* 둘러보기 */}
          <li>
            <Link to="/" onClick={() => setActive
              (false) + setActiveHome(true)} className="flex flex-col items-center gap-1 p-2"><svg className={"w-7 " + (activeHome ? "fill-red-500" : "fill-gray-800")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" /></svg>
              <span className="text-xs">둘러보기</span>
            </Link>
          </li>
          <li>
            <Link to="/create" className="flex flex-col items-center gap-1 p-2"><svg className="w-8 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" /></svg>
              <span className="text-xs">게시물생성</span>
            </Link>
          </li>
          {/* 위시리스트 */}
          <li>
            <Link to="/favorite" onClick={() => setActive(true) + setActiveHome(false)} className="flex flex-col items-center gap-1 p-2"><svg className={"w-7 " + (active ? "fill-red-500" : "fill-gray-800")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" /></svg><span className="text-xs">위시리스트</span></Link>
          </li>
          {/* 로그인 */}
          <li>
            <Link to="/login" className="flex flex-col items-center gap-1 p-2"><svg className="w-6  " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg><span className="text-xs">로그인</span></Link>
          </li>
        </ul>
      </nav>

      <div className="mt-24 mb-24 mx-4 ">
        <Outlet />
      </div>
    </div>
  )

}