import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readVersion } from "@blueprint-studio/galley/editor";
import { openPage, sectionsManifest } from "@blueprint-studio/galley/pages";
import { listRequests } from "@blueprint-studio/galley/requests";
import { PageEditor, type LibrarySection, type PageSection, type Vocabulary } from "@blueprint-studio/galley/editor-ui";
import { getAllPosts } from "@/lib/blog";
import galley from "@/galley.config";
import { InsightsFrame } from "@/components/insights/frame";
import { Footer } from "@/components/Footer/index";
import {
  createPostAction,
  discardPageAction,
  duplicatePostAction,
  pageVersionsAction,
  postRowsAction,
  publishPageAction,
  publishPostAction,
  renderSectionAction,
  requestDesignAction,
  restorePageAction,
  savePageAction,
  siteLibraryAction,
  trashPostAction,
  unpublishPostAction,
  untrashPostAction,
} from "./actions";
import { editorEnabled } from "./enabled";
import { whoAmI } from "./who";

// The Insights page in edit mode: the same page as /insights, built from the sections in
// content/pages/insights.json. Select a section to set it up, add one, write a new post,
// find any post in All posts. ?version=<id> shows an earlier version, read-only.

export const metadata: Metadata = { title: "Edit Insights", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditInsights({ searchParams }: { searchParams: Promise<{ version?: string }> }) {
  if (!editorEnabled()) notFound();
  const { version: versionId } = await searchParams;
  const cwd = process.cwd();
  const { page: current, revision, state } = await openPage(cwd, "insights", galley.pages!.insights);
  const version = versionId ? await readVersion(cwd, "pages/insights", versionId) : null;
  const page = version ? (JSON.parse(version.source) as unknown) : current;
  const vocabulary: Vocabulary = {
    posts: { kind: "posts", terms: getAllPosts().map((p) => ({ slug: p.slug, name: p.title, description: p.date, image: p.image })) },
  };
  return (
    <div>
      <InsightsFrame>
        <PageEditor
          key={version?.id ?? "now"}
          page={page as { settings?: Record<string, unknown>; sections: PageSection[] }}
          revision={revision}
          state={state}
          library={JSON.parse(JSON.stringify(sectionsManifest(galley.sections ?? []))) as LibrarySection[]}
          vocabulary={vocabulary}
          actions={{
            save: savePageAction,
            render: renderSectionAction,
            versions: pageVersionsAction,
            restore: restorePageAction,
            publish: publishPageAction,
            discard: discardPageAction,
            siteLibrary: siteLibraryAction,
            posts: {
              rows: postRowsAction,
              duplicate: duplicatePostAction,
              publish: publishPostAction,
              unpublish: unpublishPostAction,
              trash: trashPostAction,
              untrash: untrashPostAction,
            },
          }}
          viewUrl="/insights"
          editUrl="/insights/edit"
          newPost={createPostAction}
          design={{ list: await listRequests(cwd), ask: requestDesignAction }}
          author={whoAmI()}
          version={version ? { id: version.id, at: version.at, author: version.author, note: version.note } : undefined}
          editLinks={{ from: "^/insights/([a-z0-9-]+)$", to: "/insights/$1/edit" }}
        >
          {null}
        </PageEditor>
      </InsightsFrame>
      <Footer />
    </div>
  );
}
