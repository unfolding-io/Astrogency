import type { GetStaticPathsResult, PaginateFunction } from "astro";
import { getCollection, getEntry } from "astro:content";

type ItemsCollection = "post" | "work";
type CategoriesCollection = "blog_category" | "work_category";

type ItemWithCategoryRefs = {
  category?: Array<string | { uuid: string }>;
};

export async function buildCategoryPaginatedRoutes(
  paginate: PaginateFunction,
  options: {
    itemsCollection: ItemsCollection;
    categoriesCollection: CategoriesCollection;
    pageSize?: number;
    onMissingSettings: () => Response;
  },
): Promise<GetStaticPathsResult | Response> {
  const pageSize = options.pageSize ?? 10;
  const locales = (await getCollection("locales")).map((locale) => locale.id);

  const pages = locales.map(async (lang, index) => {
    const routeLang = index === 0 ? undefined : lang;
    const status = import.meta.env.DEV ? "draft" : "published";

    const [posts, categories, settings] = await Promise.all([
      getCollection(options.itemsCollection, ({ data }) => data.lang === lang),
      getCollection(options.categoriesCollection, ({ data }) => data.lang === lang),
      getEntry("settings", lang),
    ]);

    if (!settings) {
      return options.onMissingSettings();
    }

    const postsData = posts.map((post) => post.data) as ItemWithCategoryRefs[];
    const categoriesData = categories.map((category) => category.data);
    const settingsData = settings.data;

    const indexPages = paginate(postsData, { pageSize });

    const groupedByCategory = postsData.reduce<
      Record<string, typeof postsData>
    >((acc, post) => {
      post.category?.forEach((item) => {
        const categoryId = typeof item === "string" ? item : item.uuid;
        if (!categoryId) return;
        acc[categoryId] = acc[categoryId] || [];
        acc[categoryId].push(post);
      });
      return acc;
    }, {});

    const categoryPages = Object.entries(groupedByCategory).flatMap(
      ([categoryId, categoryPosts]) => {
        const category = categoriesData.find((cat) => cat.uuid === categoryId);
        if (!category) return [];

        return paginate(categoryPosts, { pageSize }).map((page) => ({
          params: {
            page: page.params.page,
            category: category.slug,
            lang: routeLang,
          },
          props: {
            ...page.props,
            status,
            settings: settingsData,
            locales,
            categories: categoriesData,
            category,
          },
        }));
      },
    );

    const basePages = indexPages.map((page) => ({
      params: {
        page: page.params.page,
        category: undefined,
        lang: routeLang,
      },
      props: {
        ...page.props,
        status,
        settings: settingsData,
        locales,
        categories: categoriesData,
      },
    }));

    return [...basePages, ...categoryPages];
  });

  const results = await Promise.all(pages);
  const redirect = results.find((r): r is Response => r instanceof Response);
  if (redirect) return redirect;

  return results.flat() as GetStaticPathsResult;
}
