import { Hero } from '@/components/hero';
import { SelectedWork } from '@/components/selected-work';
import { Companies } from '@/components/companies';
import { ToolsPlatforms } from '@/components/tools-platforms';
import { ScrollChapters } from '@/components/scroll-chapters';
import { ScrollFoundation } from '@/components/scroll-foundation';
import { AnalyticsResults } from '@/components/analytics-results';
import { Services } from '@/components/services';
import { AboutAilyn } from '@/components/about-ailyn';
import { Contact } from '@/components/contact';

export default function Home() {
  return <><ScrollChapters /><main id="main-content" className="chapter-page">
    <ScrollFoundation><Hero /><SelectedWork /><AnalyticsResults /><Companies /><AboutAilyn /><Services /><ToolsPlatforms /><Contact /></ScrollFoundation>
  </main></>;
}
