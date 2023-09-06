import { PageSEO } from "@/components/SEO";
import siteMetadata from "@/data/siteMetadata";
import ListLayout from "@/layouts/ListLayout";

export default function PostPage({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={siteMetadata.description}
      />
      console.log("pagejs",posts);
      console.log("initialDisplayPosts",initialDisplayPosts);
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  );
}
