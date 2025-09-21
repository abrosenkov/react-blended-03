import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import { useDebouncedCallback } from "use-debounce";
import CreatePostForm from "../CreatePostForm/CreatePostForm";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const changeQuery = useDebouncedCallback((query: string) => {
    setQuery(query);
  }, 500);

  const changePage = (page: number) => {
    setPage(page);
  };

  const onModalClose = () => setIsModalOpen(false);

  // useEffect(() => {
  //   async function fetchData() {
  //     const result = await fetchData();
  //   }
  //   fetchData();
  // }, []);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["posts", query, page],
    queryFn: () => fetchPosts(query, page),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={changeQuery} />
        <Pagination
          currentPage={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={changePage}
        />
        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create post
        </button>
      </header>
      {isLoading && <div>...loading</div>}
      {isModalOpen && (
        <Modal>
          <CreatePostForm onClose={onModalClose} />
        </Modal>
      )}

      {isSuccess && data.posts.length > 0 && <PostList posts={data.posts} />}
    </div>
  );
}
