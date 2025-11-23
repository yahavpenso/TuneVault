import { Music, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl font-bold text-foreground">
                TuneDownload
              </span>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Fast and reliable music downloads with support for multiple platforms and formats.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-faq"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-supported-platforms"
                >
                  Supported Platforms
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-terms"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-privacy"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-muted hover-elevate active-elevate-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
                data-testid="link-github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-muted hover-elevate active-elevate-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-muted hover-elevate active-elevate-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
                data-testid="link-email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="font-body text-sm text-muted-foreground">
            © {currentYear} TuneDownload. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
