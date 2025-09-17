import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNativeFeatures } from "@/hooks/use-native-features";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
}

export function ShareButton({ title, text, url, className }: ShareButtonProps) {
  const { toast } = useToast();
  const { isNative } = useNativeFeatures();

  const handleShare = async () => {
    // Try native sharing first (mobile)
    if (isNative && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
        return;
      } catch (error) {
        // User cancelled or sharing failed, fall back to copy
        console.log('Native sharing cancelled or failed:', error);
      }
    }

    // Web sharing fallback - copy to clipboard
    try {
      const shareText = `${title}\n${text}\n${url}`;
      await navigator.clipboard.writeText(shareText);
      
      toast({
        title: "Link Copied!",
        description: "The listing link has been copied to your clipboard",
      });
    } catch (error) {
      // Ultimate fallback - select text
      const textArea = document.createElement('textarea');
      textArea.value = `${title}\n${text}\n${url}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Link Copied!",
        description: "The listing link has been copied to your clipboard",
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className={className}
      data-testid="button-share"
    >
      <i className="fas fa-share-alt mr-2"></i>
      Share
    </Button>
  );
}