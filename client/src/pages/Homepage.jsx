import axios from "axios";
import { useEffect, useState } from "react";

function Homepage() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const getPosts = async () => {
    if (searchInput.includes(" ")) {
      const modifiedSearchInput = searchInput.trimEnd().replaceAll(" ", "&");
      const response = await axios.get(
        `http://localhost:4001/trips?keywords=${modifiedSearchInput}`
      );
      setPosts(response.data.data);
      console.log(
        "mo",
        `http://localhost:4001/trips?keywords=${modifiedSearchInput}`
      );
    } else {
      const response = await axios.get(
        `http://localhost:4001/trips?keywords=${searchInput}`
      );
      setPosts(response.data.data);
      console.log(`http://localhost:4001/trips?keywords=${searchInput}`);
    }
  };

  useEffect(() => {
    getPosts();
  }, [searchInput]);

  const textLimit = (description) => {
    const maxChars = 100;
    return description.length > maxChars
      ? description.substring(0, maxChars) + " ... "
      : description;
  };

  const additionalPhotos = (photos) => {
    const clonePhotos = [...photos];
    clonePhotos.shift();
    return clonePhotos.map((item, index) => {
      return <img key={index} src={item} />;
    });
  };

  const renderCategory = (tags) => {
    const handleTagClick = (tag) => {
      setSearchInput(searchInput + tag + " ");
    };

    const cloneTags = [...tags];
    const lastTag = cloneTags.pop();

    return (
      <ul>
        {cloneTags.map((item, index) => (
          <li
            onClick={() => {
              handleTagClick(item);
            }}
            key={index}
          >
            {item}
          </li>
        ))}
        และ
        <li
          onClick={() => {
            handleTagClick(lastTag);
          }}
        >
          {lastTag}
        </li>
      </ul>
    );
  };

  return (
    <div>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
      </style>
      <h1
        className="main-title"
        onClick={() => {
          setSearchInput("");
        }}
      >
        เที่ยวไหนดี
      </h1>
      <div className="search-box">
        <p className="search">ค้นหาที่เที่ยว</p>
        <input
          type="text"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
        />
      </div>
      <div className="section">
        <div className="section-message">หาที่เที่ยวแล้วไปกัน ...</div>
        <div className="result-count">Results ({posts.length})</div>
      </div>
      <div className="post-list">
        {posts.map((post, index) => {
          return (
            <div className="post-item" key={index}>
              <img className="main-image" src={post.photos[0]} />
              <div className="post-details">
                <h4
                  className="post-title"
                  onClick={() => {
                    window.open(post.url, "_blank");
                  }}
                >
                  {post.title}
                </h4>
                <p className="post-desc" id="post-desc">
                  {textLimit(post.description)}
                  <a href={post.url} target="_blank">
                    อ่านต่อ
                  </a>
                </p>
                <div className="category">หมวด {renderCategory(post.tags)}</div>
                <div className="post-footer">
                  <div className="additional-photo">
                    {additionalPhotos(post.photos)}
                  </div>
                  <img
                    className="share-button"
                    src="https://cdn-icons-png.freepik.com/512/6994/6994770.png"
                    onClick={() => {
                      navigator.clipboard.writeText(post.url);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Homepage;
