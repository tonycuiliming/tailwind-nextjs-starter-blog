import React, { useState } from "react";
import Link from "@/components/Link";
import { PageSEO } from "@/components/SEO";
import Tag from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import formatDate from "@/lib/utils/formatDate";

import SideWidget from "./side";

import Pagination from "./Pagination";

const MAX_DISPLAY = 50;

const apiUrl = process.env.NEXT_PUBLIC_BACKEND;
const sideUrl = process.env.NEXT_PUBLIC_BACKEND_SIDE;

export async function getServerSideProps() {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page: 0 }),
  });

  const data = JSON.parse(await response.json());
  const currentPosts = data["initialDisplayPosts"];
  const totalPages = data["totalPages"];
  const seoTitle = data["seo_title"];
  const seoDes = data["seo_des"];
  const tags = data["tags"];

  const responseSide = await fetch(sideUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page: 0 }),
  });
  const sideData = JSON.parse(await responseSide.json())["initialDisplayPosts"];
  return {
    props: { currentPosts, totalPages, seoTitle, seoDes, tags, sideData },
  };
}

export default function Home({
  currentPosts,
  totalPages,
  seoTitle,
  seoDes,
  tags,
  sideData,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [posts, setCurrentPosts] = useState(currentPosts);

  const handlePageChange = async (pageIn) => {
    setCurrentPage(pageIn);

    const response = await fetch(apiUrl, {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pageIn }),
    });

    const data = JSON.parse(await response.json());
    const newPosts = data["initialDisplayPosts"];
    setCurrentPosts(newPosts);
  };

  return (
    <>
      <PageSEO title={seoTitle} description={seoDes} tags={tags} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            热门文章
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && "No posts found."}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter;
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <Link
                            href={`/blog/${slug}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {summary}
                          </Link>
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          点击阅读更多 &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      <SideWidget widgetData={sideData} />

      <Pagination
        totalPages={totalPages}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />
    </>
  );
}
