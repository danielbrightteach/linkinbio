"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ExternalLink, Globe, Instagram, Youtube, Facebook } from "lucide-react"
import { Card } from "@/components/ui/card"
// import { gtag } from "@/lib/gtag" // Declare the gtag variable
// import { AnalyticsInfo } from "@/components/analytics-info"

interface LinkItem {
  title: string
  url: string
  icon: React.ReactNode
  isMainWebsite?: boolean
}

export default function BrightTeachLinktree() {
  const [websiteUrl, setWebsiteUrl] = useState("https://www.brightteach.com/study")

  useEffect(() => {
    // Function to detect referrer and add appropriate UTM parameter
    const addUTMParameter = () => {
      const referrer = document.referrer.toLowerCase()
      const currentUrl = window.location.href.toLowerCase()
      let utmSource = "direct"
      let utmContent = ""

      // Enhanced referrer detection with specific account tracking
      if (referrer.includes("tiktok.com")) {
        utmSource = "tiktok"
        // You can add specific TikTok account detection here if needed
        if (referrer.includes("@brightteach1")) utmContent = "account1"
        else if (referrer.includes("@brightteach2")) utmContent = "account2"
        else utmContent = "main"
      } else if (referrer.includes("instagram.com")) {
        utmSource = "instagram"
        if (referrer.includes("stories")) utmContent = "story"
        else if (referrer.includes("reel")) utmContent = "reel"
        else utmContent = "bio"
      } else if (referrer.includes("facebook.com")) {
        utmSource = "facebook"
        if (referrer.includes("story")) utmContent = "story"
        else if (referrer.includes("post")) utmContent = "post"
        else utmContent = "page"
      } else if (referrer.includes("twitter.com") || referrer.includes("x.com")) {
        utmSource = "twitter"
        utmContent = "bio"
      } else if (referrer.includes("linkedin.com")) {
        utmSource = "linkedin"
        utmContent = "profile"
      } else if (referrer.includes("youtube.com")) {
        utmSource = "youtube"
        if (referrer.includes("shorts")) utmContent = "shorts"
        else if (referrer.includes("watch")) utmContent = "video"
        else utmContent = "channel"
      } else if (referrer.includes("snapchat.com")) {
        utmSource = "snapchat"
        utmContent = "story"
      } else if (referrer.includes("pinterest.com")) {
        utmSource = "pinterest"
        utmContent = "pin"
      } else if (referrer.includes("threads.net")) {
        utmSource = "threads"
        utmContent = "post"
      }

      // Check for custom URL parameters (for manual tracking)
      const urlParams = new URLSearchParams(window.location.search)
      const customSource = urlParams.get("ref")
      const customContent = urlParams.get("content")

      if (customSource) {
        utmSource = customSource
        utmContent = customContent || utmContent
      }

      // Build comprehensive UTM parameters
      const baseUrl = "https://www.brightteach.com/study"
      const utmParams = new URLSearchParams({
        utm_source: utmSource,
        utm_medium: "social",
        utm_campaign: "linktree_2024",
        ...(utmContent && { utm_content: utmContent }),
        utm_term: "brightteach_links",
      })

      const urlWithUTM = `${baseUrl}?${utmParams.toString()}`
      setWebsiteUrl(urlWithUTM)

      // Track the linktree visit itself
      console.log(`Linktree visited from: ${utmSource}${utmContent ? ` (${utmContent})` : ""}`)
    }

    addUTMParameter()
  }, [])

  const links: LinkItem[] = [
    {
      title: "Visit Our Website",
      url: websiteUrl,
      icon: <Globe className="w-5 h-5" />,
      isMainWebsite: true,
    },
    {
      title: "Follow on Instagram",
      url: "https://www.instagram.com/brightteachstudy/",
      icon: <Instagram className="w-5 h-5" />,
    },
    {
      title: "Like us on Facebook",
      url: "https://www.facebook.com/brightteachstudy",
      icon: <Facebook className="w-5 h-5" />,
    },
    {
      title: "Subscribe on YouTube",
      url: "https://www.youtube.com/@brightteachstudy",
      icon: <Youtube className="w-5 h-5" />,
    },
  ]

  const handleLinkClick = (url: string, title: string) => {
    // Get current UTM parameters from the current page URL
    const currentParams = new URLSearchParams(window.location.search)
    const customSource = currentParams.get("ref")
    const customContent = currentParams.get("content")

    let finalUrl = url

    // If this is the main website link, preserve and enhance UTM parameters
    if (title === "Visit Our Website") {
      const urlObj = new URL(url)
      const existingParams = new URLSearchParams(urlObj.search)

      // If we have custom ref parameters from the linktree URL, use those
      if (customSource) {
        existingParams.set("utm_source", customSource)
        if (customContent) {
          existingParams.set("utm_content", customContent)
        }
      }

      urlObj.search = existingParams.toString()
      finalUrl = urlObj.toString()
    } else {
      // For social media links, add tracking parameters to see where the click came from
      if (customSource || customContent) {
        const separator = url.includes("?") ? "&" : "?"
        const trackingParams = new URLSearchParams()

        if (customSource) trackingParams.set("ref", customSource)
        if (customContent) trackingParams.set("content", customContent)

        finalUrl = `${url}${separator}${trackingParams.toString()}`
      }
    }

    // Enhanced click tracking with preserved parameters
    const clickData = {
      link_title: title,
      destination_url: finalUrl,
      source_platform: customSource || extractSourceFromReferrer(),
      source_content: customContent || "",
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    }

    console.log("Link clicked:", clickData)

    // Google Analytics tracking (if available)
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      ;(window as any).gtag("event", "link_click", {
        link_url: finalUrl,
        link_text: title,
        source: customSource || extractSourceFromReferrer(),
        content: customContent || "",
      })
    }

    window.open(finalUrl, "_blank", "noopener,noreferrer")
  }

  // Helper function to extract source from referrer
  const extractSourceFromReferrer = () => {
    const referrer = document.referrer.toLowerCase()
    if (referrer.includes("tiktok.com")) return "tiktok"
    if (referrer.includes("instagram.com")) return "instagram"
    if (referrer.includes("facebook.com")) return "facebook"
    if (referrer.includes("youtube.com")) return "youtube"
    if (referrer.includes("twitter.com") || referrer.includes("x.com")) return "twitter"
    if (referrer.includes("linkedin.com")) return "linkedin"
    return "direct"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Facebook Template Design */}
      <div className="relative overflow-hidden border-b-4 border-[#4f80ff]">
        <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 relative">
          <img
            src="/images/facebook-template.png"
            alt="Bright Teach Facebook Template"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        {/* Add a decorative border overlay */}
        <div className="absolute inset-0 border-4 border-[#fde548] opacity-20 pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-md relative -mt-12 sm:-mt-16">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <img src="/images/bt-torch.png" alt="Bright Teach Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1
            className="text-2xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: "Filson Pro, system-ui, sans-serif" }}
          >
            Bright Teach
          </h1>
          <p
            className="text-gray-600 text-sm leading-relaxed"
            style={{ fontFamily: "Filson Pro, system-ui, sans-serif" }}
          >
            We help students reach their full potential. Connect with us across all platforms!
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <Card
              key={index}
              className={`transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer border-0 ${
                link.isMainWebsite
                  ? "bg-[#4f80ff] text-white shadow-lg"
                  : "bg-white shadow-md hover:bg-gray-50 border border-gray-100"
              }`}
              onClick={() => handleLinkClick(link.url, link.title)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`${link.isMainWebsite ? "text-white" : "text-[#4f80ff]"}`}>{link.icon}</div>
                  <span
                    className={`font-medium ${link.isMainWebsite ? "text-white" : "text-gray-800"}`}
                    style={{ fontFamily: "Filson Pro, system-ui, sans-serif" }}
                  >
                    {link.title}
                  </span>
                </div>
                <ExternalLink className={`w-4 h-4 ${link.isMainWebsite ? "text-white/80" : "text-gray-400"}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Embedded Content */}
        <div className="space-y-6 mt-8">
          {/* Spotify Embed */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="p-4 bg-[#4f80ff] text-white">
              <h3 className="font-medium" style={{ fontFamily: "Filson Pro, system-ui, sans-serif" }}>
                Listen to Our Podcast
              </h3>
            </div>
            <div className="p-4">
              <iframe
                src="https://open.spotify.com/embed/show/1pMg1gOw91usNj8CZDqbrO?utm_source=generator&theme=0"
                width="100%"
                height="232"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded"
              ></iframe>
            </div>
          </div>

          {/* YouTube Video 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="p-4 bg-[#4f80ff] text-white">
              <h3 className="font-medium" style={{ fontFamily: "Filson Pro, system-ui, sans-serif" }}>
                Featured Video
              </h3>
            </div>
            <div className="p-4">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src="https://www.youtube.com/embed/5XSUEWzDcuc"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded"
                ></iframe>
              </div>
            </div>
          </div>

          {/* YouTube Video 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="p-4 bg-[#4f80ff] text-white">
              <h3 className="font-medium" style={{ fontFamily: "Filson Pro, system-ui, sans-serif" }}>
                Latest Content
              </h3>
            </div>
            <div className="p-4">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src="https://www.youtube.com/embed/B4dXhT7Lnxc"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500" style={{ fontFamily: "Filson Pro, system-ui, sans-serif" }}>
            © 2024 Bright Teach. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "Filson Pro, system-ui, sans-serif" }}>
            Smart link tracking enabled
          </p>
        </div>

        {/* Analytics Info */}
      </div>
    </div>
  )
}
