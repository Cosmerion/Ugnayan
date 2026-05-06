interface AIInsightBoxProps {
  memberId: string;
  insight: string | null;
  error: boolean;
  noKey: boolean;
}

/**
 * Displays an AI-generated insight for a member.
 * Handles four states: no API key, error, loading (skeleton), and loaded.
 */
export default function AIInsightBox({ insight, error, noKey }: AIInsightBoxProps) {
  function renderContent() {
    if (noKey) {
      return (
        <p className="text-baro-brown/70 text-sm">
          AI insights require a Gemini API key. Add{' '}
          <code className="bg-baro-amber/30 px-1 rounded text-xs">VITE_GEMINI_API_KEY</code>{' '}
          to <code className="bg-baro-amber/30 px-1 rounded text-xs">.env.local</code>
        </p>
      );
    }

    if (error) {
      return (
        <p className="text-baro-terra text-sm">
          Unable to load AI insight. Please try again later.
        </p>
      );
    }

    if (insight === null) {
      // Skeleton loader
      return (
        <div className="space-y-2">
          <div className="bg-baro-amber/40 animate-pulse rounded h-4 w-full" />
          <div className="bg-baro-amber/40 animate-pulse rounded h-4 w-5/6" />
          <div className="bg-baro-amber/40 animate-pulse rounded h-4 w-4/6" />
        </div>
      );
    }

    return (
      <p className="bg-baro-offwhite border-l-4 border-baro-gold rounded-r-lg p-4 text-baro-brown text-sm leading-relaxed">
        {insight}
      </p>
    );
  }

  return (
    <div className="bg-baro-cream rounded-xl border border-baro-amber/40 p-4">
      <h3 className="font-display text-baro-brown text-base mb-3">✨ AI Insight</h3>
      {renderContent()}
    </div>
  );
}
