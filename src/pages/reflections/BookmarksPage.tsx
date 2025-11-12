import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import axios from "axios";
import { Container } from "@/components/container";
import {LucideSearch,LucideCalendar,LucideTrash2,LucideArrowLeft,} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBible } from "@/providers/BibleProvider";
import { useReflection } from "@/providers/ReflectionProvider";

const BookmarksPage = () => {
  const navigate = useNavigate();
  // const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  // const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectBook, selectChapter, fetchSingleVerse, books,toggleVerseBookmark } = useBible();

  const { dailyReflection, loading, error, bookmarks, bmLoading, fetchBookmarks, setBookmarks } = useReflection();


  const handleOpenBookmark = async (entry: any) => {
    const { book, chapter, verse, version } = entry;
    if (!book || !chapter || !verse) return;

    const bookSlug = book.trim().toLowerCase().replace(/\s+/g, "-");
    const foundBook = books?.find(
      (b: any) => b.name.toLowerCase() === book.trim().toLowerCase()
    );

    if (foundBook) {
      await selectBook(foundBook.book_id, foundBook.name);
      await selectChapter(Number(chapter));
      await fetchSingleVerse(foundBook.book_id, Number(chapter), Number(verse), version || "KJV");
    }

    navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);
  };

  const handleDeleteBookmark = async (entry: any) => {
  try {
    await toggleVerseBookmark(entry.book, Number(entry.chapter), Number(entry.verse), entry.version || "KJV");
    setBookmarks((prev: any[]) => prev.filter((b) => b.bookmark_id !== entry.bookmark_id));

    console.log("Bookmark deleted successfully:", entry.reference);
  } catch (err) {
    console.error("Error deleting bookmark:", err);
  }
};
  const filtered = bookmarks.filter(
    (b: { reference: string; verse_text: string; }) =>
      b.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.verse_text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleBookmarks = filtered.slice(0, visibleCount);
  const showLoadMore = filtered.length >= 6;


  return (
    <Container>
      <div className="min-h-screen p-0">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-4">
            <button
              onClick={() => navigate("/reflections")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
            >
              <LucideArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Reflections</span>
            </button>
          </div>

          <h1 className="font-merriweather text-4xl text-primary mb-2">
            Bookmarks
          </h1>
          <p className="text-gray-600 text-lg">
            Your saved verses and reflections for quick access
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bookmarks by verse or content..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sand/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="font-merriweather text-lg text-gray-600">
            Showing {filtered.length} Bookmarks
          </h2>
        </div>

        {/* Bookmarks Grid */}
        {loading ? (
          <p className="text-gray-500 italic">Loading bookmarks...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 italic">No bookmarks found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleBookmarks.map((entry: { bookmark_id: Key | null | undefined; reference: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; verse_text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; emotion_tags: string[]; }) => (
                <div
                  key={entry.bookmark_id}
                  onClick={() => handleOpenBookmark(entry)}
                  className="bg-white/80 dark:bg-transparent rounded-xl p-6 border border-transparent dark:border-gray-400 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <LucideCalendar className="text-amber-600 w-4 h-4" />
                    <span className="text-gray-600 text-sm font-medium">
                      {entry.reference}
                    </span>
                  </div>

                  <p className="text-primary text-sm leading-relaxed mb-4 line-clamp-3">
                    {entry.verse_text}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {entry.emotion_tags?.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleDeleteBookmark(entry.bookmark_id);
                        handleDeleteBookmark(entry);
                      }}
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors"
                    >
                      <LucideTrash2 className="text-red-500 w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/*  Fixed Load More Button */}
            {!loading && showLoadMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibleCount(filtered.length)} // show all bookmarks
                  className="px-6 py-3 bg-sand text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
                >
                  Load More Bookmarks
                </button>
              </div>
            )}

          </>
        )}
      </div>
    </Container>
  );
};

export { BookmarksPage };




