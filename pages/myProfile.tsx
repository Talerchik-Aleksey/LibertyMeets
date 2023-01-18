import { GetServerSideProps } from "next";
import config from "config";
import Settings from "./settings";
import { Button } from "antd";
import React, { useState } from "react";
import { truncate } from "fs";

type PropsType = { appUrl: string };
type PostType = {
  id: number;
  title: string;
  is_favorite?: boolean;
  geo: string;
  event_time: Date;
  category: string;
  favoriteUsers: { id: number }[];
};

export default function MyProfile({ appUrl }: PropsType) {
  const tabs = ["My Favorites", "My Posts", "Settings"];
  const [activeTab, setActiveTab] = useState("My Favorites");

  const handleClick = (value: string) => {
    setActiveTab(value);
  };

  return (
    <>
      <div>
        <Button type="text" onClick={() => handleClick(tabs[0])}>
          My Favorites
        </Button>
        <Button type="text" onClick={() => handleClick(tabs[1])}>
          My Posts
        </Button>
        <Button type="text" onClick={() => handleClick(tabs[2])}>
          Settings
        </Button>
      </div>
      <div hidden={activeTab !== "My Favorites"}>
        <hr />
      </div>
      <div hidden={activeTab !== "My Posts"}>
        <hr />
        <hr />
      </div>
      <div hidden={activeTab !== "Settings"}>
        <Settings appUrl={appUrl} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const appUrl = config.get<string>("appUrl");

  return {
    props: { appUrl },
  };
};
