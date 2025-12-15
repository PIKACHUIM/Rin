import { useContext, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import Popup from "reactjs-popup";
import { Link, useLocation } from "wouter";
import { useAlert, useConfirm } from "../components/dialog";
import { HashTag } from "../components/hashtag";
import { Waiting } from "../components/loading";
import { Markdown } from "../components/markdown";
import { client } from "../main";
import { ClientConfigContext } from "../state/config";
import { ProfileContext } from "../state/profile";
import { headersWithAuth } from "../utils/auth";
import { siteName } from "../utils/constants";
import { timeago } from "../utils/timeago";
import { Button } from "../components/button";
import { Tips } from "../components/tips";
import { useLoginModal } from "../hooks/useLoginModal";
import mermaid from "mermaid";

type Feed = {
  id: number;
  title: string | null;
  content: string;
  uid: number;
  createdAt: Date;
  updatedAt: Date;
  hashtags: {
    id: number;
    name: string;
  }[];
  user: {
    avatar: string | null;
    id: number;
    username: string;
  };
  pv: number;
  uv: number;
};

export function FeedPage({ id, TOC, clean }: { id: string, TOC: () => JSX.Element, clean: (id: string) => void }) {
  const { t } = useTranslation();
  const profile = useContext(ProfileContext);
  const [feed, setFeed] = useState<Feed>();
  const [error, setError] = useState<string>();
  const [headImage, setHeadImage] = useState<string>();
  const ref = useRef("");
  const [_, setLocation] = useLocation();
  const { showAlert, AlertUI } = useAlert();
  const { showConfirm, ConfirmUI } = useConfirm();
  const [top, setTop] = useState<number>(0);
  const config = useContext(ClientConfigContext);
  const counterEnabled = config.get<boolean>('counter.enabled');
  function deleteFeed() {
    // Confirm
    showConfirm(
      t("article.delete.title"),
      t("article.delete.confirm"),
      () => {
        if (!feed) return;
        client
          .feed({ id: feed.id })
          .delete(null, {
            headers: headersWithAuth(),
          })
          .then(({ error }) => {
            if (error) {
              showAlert(error.value as string);
            } else {
              showAlert(t("delete.success"));
              setLocation("/");
            }
          });
      })
  }
  function topFeed() {
    const isUnTop = !(top > 0)
    const topNew = isUnTop ? 1 : 0;
    // Confirm
    showConfirm(
      isUnTop ? t("article.top.title") : t("article.untop.title"),
      isUnTop ? t("article.top.confirm") : t("article.untop.confirm"),
      () => {
        if (!feed) return;
        client
          .feed.top({ id: feed.id })
          .post({
            top: topNew,
          }, {
            headers: headersWithAuth(),
          })
          .then(({ error }) => {
            if (error) {
              showAlert(error.value as string);
            } else {
              showAlert(isUnTop ? t("article.top.success") : t("article.untop.success"));
              setTop(topNew);
            }
          });
      })
  }
  useEffect(() => {
    if (ref.current == id) return;
    setFeed(undefined);
    setError(undefined);
    setHeadImage(undefined);
    client
      .feed({ id })
      .get({
        headers: headersWithAuth(),
      })
      .then(({ data, error }) => {
        if (error) {
          setError(error.value as string);
        } else if (data && typeof data !== "string") {
          setTimeout(() => {
            setFeed(data);
            setTop(data.top);
            // Extract head image
            const img_reg = /!\[.*?\]\((.*?)\)/;
            const img_match = img_reg.exec(data.content);
            if (img_match) {
              setHeadImage(img_match[1]);
            }
            clean(id);
          }, 0);
        }
      });
    ref.current = id;
  }, [id]);
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    });
    mermaid.run({
      suppressErrors: true,
      nodes: document.querySelectorAll("pre.mermaid_default")
    }).then(()=>{
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
      });
      mermaid.run({
        suppressErrors: true,
        nodes: document.querySelectorAll("pre.mermaid_dark")
      });
    })
  }, [feed]);

  return (
    <Waiting for={feed || error}>
      {feed && (
        <Helmet>
          <title>{`${feed.title ?? "Unnamed"} - ${process.env.NAME}`}</title>
          <meta property="og:site_name" content={siteName} />
          <meta property="og:title" content={feed.title ?? ""} />
          <meta property="og:image" content={headImage ?? process.env.AVATAR} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={document.URL} />
          <meta
            name="og:description"
            content={
              feed.content.length > 200
                ? feed.content.substring(0, 200)
                : feed.content
            }
          />
          <meta name="author" content={feed.user.username} />
          <meta
            name="keywords"
            content={feed.hashtags.map(({ name }) => name).join(", ")}
          />
          <meta
            name="description"
            content={
              feed.content.length > 200
                ? feed.content.substring(0, 200)
                : feed.content
            }
          />
        </Helmet>
      )}
      <div className="w-full flex flex-row justify-center ani-show">
        {error && (
          <>
            <div className="flex flex-col wauto rounded-2xl m-2 p-8 items-center justify-center space-y-4 shadow-aurora"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  border: '1px solid var(--background-trans)'
                }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                  style={{ background: 'var(--main-gradient)' }}>
                <i className="ri-error-warning-line text-4xl text-white"></i>
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>{error}</h1>
              {error === "Not found" && id === "about" && (
                <Tips value={t("about.notfound")} />
              )}
              <Button
                title={t("index.back")}
                onClick={() => (window.location.href = "/")}
              />
            </div>
          </>
        )}
        {feed && !error && (
          <>
            <main className="wauto" style={{ maxWidth: '900px', marginTop: '10rem' }} >
              <article
                className="rounded-2xl m-2 p-4 lg:p-14 shadow-aurora"
                style={{
                  background: 'linear-gradient(135deg, rgba(var(--background-secondary-rgb), 0.75), rgba(var(--background-primary-rgb), 0.8))',
                  border: '1px solid rgba(var(--background-trans-rgb), 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
                aria-label={feed.title ?? "Unnamed"}
              >
                <div className="flex justify-between mb-8">
                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-extrabold mb-6 break-all relative pb-4" 
                        style={{ color: 'var(--text-bright)' }}>
                      {feed.title}
                      <span className="absolute bottom-0 left-0 h-1 w-24 rounded-full" 
                          style={{ background: 'var(--main-gradient)' }}></span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" style={{ color: 'var(--text-dim)' }}>
                      <span className="flex items-center" title={new Date(feed.createdAt).toLocaleString()}>
                        <i className="ri-calendar-line mr-1"></i>
                        {t("feed_card.published$time", {
                          time: timeago(feed.createdAt),
                        })}
                      </span>

                      {feed.createdAt !== feed.updatedAt && (
                        <span className="flex items-center" title={new Date(feed.updatedAt).toLocaleString()}>
                          <i className="ri-edit-line mr-1"></i>
                          {t("feed_card.updated$time", {
                            time: timeago(feed.updatedAt),
                          })}
                        </span>
                      )}
                      
                      {counterEnabled && (
                        <>
                          <span className="flex items-center">
                            <i className="ri-eye-line mr-1"></i>
                            {feed.pv} {t("count.pv")}
                          </span>
                          <span className="flex items-center">
                            <i className="ri-user-line mr-1"></i>
                            {feed.uv} {t("count.uv")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 ml-4">
                    {profile?.permission && (
                      <div className="flex gap-2">
                        <button
                          aria-label={top > 0 ? t("untop.title") : t("top.title")}
                          onClick={topFeed}
                          className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
                          style={top > 0 ? {
                            background: 'var(--main-gradient)',
                            color: 'white',
                            boxShadow: 'var(--accent-shadow)'
                          } : {
                            backgroundColor: 'var(--background-secondary)',
                            color: 'var(--text-dim)',
                            border: '1px solid var(--background-trans)'
                          }}
                        >
                          <i className="ri-skip-up-line" />
                        </button>
                        <Link
                          aria-label={t("edit")}
                          href={`/writing/${feed.id}`}
                          className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
                          style={{
                            backgroundColor: 'var(--background-secondary)',
                            color: 'var(--text-dim)',
                            border: '1px solid var(--background-trans)'
                          }}
                        >
                          <i className="ri-edit-2-line" />
                        </Link>
                        <button
                          aria-label={t("delete.title")}
                          onClick={deleteFeed}
                          className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
                          style={{
                            backgroundColor: 'var(--background-secondary)',
                            color: '#ef4444',
                            border: '1px solid var(--background-trans)'
                          }}
                        >
                          <i className="ri-delete-bin-7-line" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-8 mb-8">
                  <Markdown content={feed.content} />
                </div>
                <div className="mt-8 pt-6 flex flex-col gap-4" style={{ borderTop: '1px solid var(--background-trans)' }}>
                  {feed.hashtags.length > 0 && (
                    <div className="flex flex-row flex-wrap gap-2 mb-4">
                      {feed.hashtags.map(({ name }, index) => (
                        <HashTag key={index} name={name} />
                      ))}
                    </div>
                  )}
                  <div className="flex flex-row items-center p-4 rounded-xl" 
                      style={{ 
                        backgroundColor: 'var(--bg-accent-05)',
                        border: '1px solid var(--background-trans)'
                      }}>
                    <img
                      src={feed.user.avatar || "/avatar.png"}
                      className="w-12 h-12 rounded-full border-2"
                      style={{ borderColor: 'var(--text-accent)' }}
                    />
                    <div className="ml-3">
                      <p className="font-semibold" style={{ color: 'var(--text-bright)' }}>
                        {feed.user.username}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                        <i className="ri-quill-pen-line mr-1"></i>
                        {t("article.author")}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
              {feed && <Comments id={`${feed.id}`} />}
              <div className="h-16" />
            </main>
            <div className="w-80 hidden lg:block relative">
              <div
                className={`ml-2 start-0 end-0 top-[5.5rem] sticky`}
              >
                <TOC />
              </div>
            </div>
          </>
        )}
      </div>
      <AlertUI />
      <ConfirmUI />
    </Waiting>
  );
}

export function TOCHeader({ TOC }: { TOC: () => JSX.Element }) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpened(true)}
        className="w-10 h-10 rounded-full flex flex-row items-center justify-center"
      >
        <i className="ri-menu-2-fill t-primary ri-lg"></i>
      </button>
      <ReactModal
        isOpen={isOpened}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "0",
            border: "none",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "none",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
        onRequestClose={() => setIsOpened(false)}
      >
        <div className="w-[80vw] sm:w-[60vw] lg:w-[40vw] overflow-clip relative t-primary">
          <TOC />
        </div>
      </ReactModal>
    </div>
  );
}

function CommentInput({
  id,
  onRefresh,
}: {
  id: string;
  onRefresh: () => void;
}) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { showAlert, AlertUI } = useAlert();
  const profile = useContext(ProfileContext);
  const { LoginModal, setIsOpened } = useLoginModal()
  function errorHumanize(error: string) {
    if (error === "Unauthorized") return t("login.required");
    else if (error === "Content is required") return t("comment.empty");
    return error;
  }
  function submit() {
    if (!profile) {
      setIsOpened(true)
      return;
    }
    client.feed
      .comment({ feed: id })
      .post(
        { content },
        {
          headers: headersWithAuth(),
        }
      )
      .then(({ error }) => {
        if (error) {
          setError(errorHumanize(error.value as string));
        } else {
          setContent("");
          setError("");
          showAlert(t("comment.success"), () => {
            onRefresh();
          });
        }
      });
  }
  return (
    <div className="w-full rounded-2xl m-2 p-6 items-end flex flex-col shadow-aurora"
        style={{
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--background-trans)'
        }}>
      <div className="flex flex-col w-full items-start mb-4">
        <h3 className="text-xl font-bold flex items-center" style={{ color: 'var(--text-bright)' }}>
          <i className="ri-chat-3-line mr-2"></i>
          {t("comment.title")}
        </h3>
      </div>
      {profile ? (<>
        <textarea
          id="comment"
          placeholder={t("comment.placeholder.title")}
          className="w-full h-32 rounded-xl p-4 transition-all duration-300"
          style={{
            backgroundColor: 'var(--background-primary)',
            color: 'var(--text-normal)',
            border: '1px solid var(--background-trans)',
            outline: 'none'
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--text-accent)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--bg-accent-05)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--background-trans)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button
          className="mt-4 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'var(--main-gradient)',
            color: 'white',
            boxShadow: 'var(--accent-shadow)'
          }}
          onClick={submit}
        >
          <i className="ri-send-plane-fill mr-2"></i>
          {t("comment.submit")}
        </button>
      </>) : (
        <div className="flex flex-row w-full items-center justify-center space-x-2 py-12">
          <button
            className="px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'var(--main-gradient)',
              color: 'white',
              boxShadow: 'var(--accent-shadow)'
            }}
            onClick={() => setIsOpened(true)}
          >
            <i className="ri-login-box-line mr-2"></i>
            {t("login.required")}
          </button>
        </div>
      )}
      {error && (
        <div className="mt-3 px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
          <i className="ri-error-warning-line mr-1"></i>
          {error}
        </div>
      )}
      <AlertUI />
      <LoginModal />
    </div>
  );
}

type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
    avatar: string | null;
    permission: number | null;
  };
};

function Comments({ id }: { id: string }) {
  const config = useContext(ClientConfigContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string>();
  const ref = useRef("");
  const { t } = useTranslation();

  function loadComments() {
    client.feed
      .comment({ feed: id })
      .get({
        headers: headersWithAuth(),
      })
      .then(({ data, error }) => {
        if (error) {
          setError(error.value as string);
        } else if (data && Array.isArray(data)) {
          setComments(data);
        }
      });
  }
  useEffect(() => {
    if (ref.current == id) return;
    loadComments();
    ref.current = id;
  }, [id]);
  return (
    <>
      {config.get<boolean>('comment.enabled') &&
        <div className="m-2 flex flex-col justify-center items-center">
          <CommentInput id={id} onRefresh={loadComments} />
          {error && (
            <>
              <div className="flex flex-col wauto rounded-2xl m-2 p-8 items-center justify-center space-y-4 shadow-aurora"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    border: '1px solid var(--background-trans)'
                  }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center" 
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <i className="ri-error-warning-line text-3xl" style={{ color: '#ef4444' }}></i>
                </div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-bright)' }}>{error}</h1>
                <button
                  className="px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: 'var(--main-gradient)',
                    color: 'white',
                    boxShadow: 'var(--accent-shadow)'
                  }}
                  onClick={loadComments}
                >
                  <i className="ri-refresh-line mr-2"></i>
                  {t("reload")}
                </button>
              </div>
            </>
          )}
          {comments.length > 0 && (
            <div className="w-full">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onRefresh={loadComments}
                />
              ))}
            </div>
          )}
        </div>
      }
    </>
  );
}

function CommentItem({
  comment,
  onRefresh,
}: {
  comment: Comment;
  onRefresh: () => void;
}) {
  const { showConfirm, ConfirmUI } = useConfirm();
  const { showAlert, AlertUI } = useAlert();
  const { t } = useTranslation();
  const profile = useContext(ProfileContext);
  function deleteComment() {
    showConfirm(
      t("delete.comment.title"),
      t("delete.comment.confirm"),
      async () => {
        client
          .comment({ id: comment.id })
          .delete(null, {
            headers: headersWithAuth(),
          })
          .then(({ error }) => {
            if (error) {
              showAlert(error.value as string);
            } else {
              showAlert(t("delete.success"), () => {
                onRefresh();
              });
            }
          });
      })
  }
  return (
    <div className="flex flex-row items-start rounded-xl mt-3 p-4 transition-all duration-300 hover:shadow-aurora"
        style={{
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--background-trans)'
        }}>
      <img
        src={comment.user.avatar || ""}
        className="w-10 h-10 rounded-full border-2"
        style={{ borderColor: 'var(--text-accent)' }}
      />
      <div className="flex flex-col flex-1 w-0 ml-3">
        <div className="flex flex-row items-center mb-2">
          <span className="text-base font-bold" style={{ color: 'var(--text-bright)' }}>
            {comment.user.username}
          </span>
          <div className="flex-1 w-0" />
          <span
            title={new Date(comment.createdAt).toLocaleString()}
            className="text-sm flex items-center"
            style={{ color: 'var(--text-dim)' }}
          >
            <i className="ri-time-line mr-1"></i>
            {timeago(comment.createdAt)}
          </span>
        </div>
        <p className="break-words mb-2" style={{ color: 'var(--text-normal)' }}>{comment.content}</p>
        <div className="flex flex-row justify-end">
          {(profile?.permission || profile?.id == comment.user.id) && (
            <Popup
              arrow={false}
              trigger={
                <button className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: 'var(--background-primary)',
                      color: 'var(--text-dim)',
                      border: '1px solid var(--background-trans)'
                    }}>
                  <i className="ri-more-fill"></i>
                </button>
              }
              position="left center"
            >
              <div className="flex flex-row self-end mr-2 rounded-xl p-2 shadow-aurora"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    border: '1px solid var(--background-trans)'
                  }}>
                <button
                  onClick={deleteComment}
                  aria-label={t("delete.comment.title")}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: 'var(--background-primary)',
                    color: '#ef4444'
                  }}
                >
                  <i className="ri-delete-bin-2-line"></i>
                </button>
              </div>
            </Popup>
          )}
        </div>
      </div>
      <ConfirmUI />
      <AlertUI />
    </div>
  );
}
