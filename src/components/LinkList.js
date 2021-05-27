import React from "react";
import Link from "./Link";
import { useQuery } from "@apollo/client";
import {  gql } from "@apollo/client";

const LinkList = () => {
  const FEED_QUERY = gql`
    {
      feed {
        id
        links {
          id
          createdAt
          url
          description
          postedBy {
            id
            name
          }
          votes {
            id
            user {
              id
            }
          }
        }
      }
    }
  `;

  const { data, loading } = useQuery(FEED_QUERY);


  return loading ? (
    <div>Loading</div>
  ) : (
    <div>
      {data &&
        data.feed.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
    </div>
  );
};

export default LinkList;
