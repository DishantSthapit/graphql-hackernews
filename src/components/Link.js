import { AUTH_TOKEN, LINKS_PER_PAGE } from "./constants";
import { useMutation, gql } from "@apollo/client";
import { timeDifferenceForDate } from "../utils";

const Link = (props) => {
  const { link } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const take = LINKS_PER_PAGE;
  const skip = 0;
  const orderBy = { createdAt: "desc" };

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

  const VOTE = gql`
    mutation VoteMutation($linkId: ID!) {
      vote(linkId: $linkId) {
        id
        link {
          id
          votes {
            id
            user {
              id
            }
          }
        }
        user {
          id
        }
      }
    }
  `;

  const [vote] = useMutation(VOTE, {
    variables: {
      linkId: link.id,
    },
    update(cache, { data: { vote } }) {
      const data = cache.readQuery({
        query: FEED_QUERY,
      });

      console.log(data)

      const updatedLinks = data.feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote],
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks,
          },
        },
      });
    },
  });

  // console.log(link);

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: "pointer" }}
            onClick={vote}
          >
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        {authToken && (
          <div className="f6 lh-copy gray">
            {link.votes.length} votes | by {link.votes[0]?.user.id}
            {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Link;
