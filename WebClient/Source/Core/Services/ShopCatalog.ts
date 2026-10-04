import { CosmeticsUrl } from "../Configuration/ShopRarity";

const MaxChapter = 2;
const MaxSeason = 7;

let Cache: Set<string> | null = null;
let Pending: Promise<Set<string>> | null = null;

interface CosmeticEntry {
  name?: string;
  introduction?: { chapter?: unknown; season?: unknown };
}

function IsLegacyRelease(Chapter: unknown, Season: unknown): boolean {
  const ChapterNumber = parseInt(String(Chapter ?? ""), 10);
  const SeasonNumber = parseInt(String(Season ?? ""), 10);

  if (!Number.isFinite(ChapterNumber)) return false;
  if (ChapterNumber < MaxChapter) return true;
  if (ChapterNumber > MaxChapter) return false;

  return Number.isFinite(SeasonNumber) && SeasonNumber <= MaxSeason;
}

export function GetLegacyItemNames(): Promise<Set<string>> {
  if (Cache) return Promise.resolve(Cache);
  if (Pending) return Pending;

  Pending = fetch(CosmeticsUrl)
    .then((Response) => Response.json())
    .then((Payload) => {
      const Names = new Set<string>();
      const Entries: CosmeticEntry[] = Payload?.data ?? [];

      for (const Entry of Entries) {
        if (!Entry?.name) continue;
        if (IsLegacyRelease(Entry.introduction?.chapter, Entry.introduction?.season)) {
          Names.add(Entry.name.trim().toLowerCase());
        }
      }

      Cache = Names;
      return Names;
    })
    .catch(() => new Set<string>())
    .finally(() => {
      Pending = null;
    });

  return Pending;
}
