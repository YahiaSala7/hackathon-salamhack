import React, { useCallback } from "react";
import { Download, Share2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import {
  BudgetDistribution,
  RecommendationItem,
} from "@/types/recommendations";
import { Product } from "@/types/product";
import { FormData } from "@/types/formData";
import { fakeRecommendationsData } from "@/utils/fakeRecommendations";

interface PhaseFiveProps {
  formData?: FormData;
  budgetDistribution?: BudgetDistribution[];
  recommendations?: Record<string, RecommendationItem[]>;
  products?: Product[];
}

function PhaseFive({
  formData,
  budgetDistribution,
  recommendations,
  products,
}: PhaseFiveProps) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const generateReport = useCallback(() => {
    // Create a hidden div for the report content
    const reportContainer = document.createElement("div");
    reportContainer.style.position = "absolute";
    reportContainer.style.left = "-9999px";
    reportContainer.style.top = "-9999px";

    // Add report content
    reportContainer.innerHTML = `
      <div id="report-content" style="width: 800px; padding: 40px; font-family: Arial, sans-serif;">
        <h1 style="font-size: 24px; margin-bottom: 20px;">Home Setup Report</h1>
        
        ${
          formData
            ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 20px; margin-bottom: 10px;">User Requirements</h2>
            <p>Budget: $${formData.budget}</p>
            <p>Style Preference: ${formData.style}</p>
            <p>Area: ${formData.area} ${formData.areaUnit}</p>
            <p>Location: ${formData.location}</p>
          </div>
        `
            : ""
        }

        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 20px; margin-bottom: 10px;">Budget Distribution</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Category</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(
                budgetDistribution || fakeRecommendationsData.budgetDistribution
              )
                .map(
                  (item) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${item.value}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 20px; margin-bottom: 10px;">Recommendations by Category</h2>
          ${Object.entries(
            recommendations || fakeRecommendationsData.recommendations
          )
            .map(
              ([category, items]) => `
            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 18px; margin-bottom: 10px;">${category}</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Price</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Rating</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
                    .map(
                      (item) => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px;">${item.title}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${item.price}</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">${item.rating} ★</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
            )
            .join("")}
        </div>

        ${
          products && products.length > 0
            ? `
          <div>
            <h2 style="font-size: 20px; margin-bottom: 10px;">Available Products</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Category</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Price</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Store</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Rating</th>
                </tr>
              </thead>
              <tbody>
                ${products
                  .map(
                    (product) => `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${product.title}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${product.category}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${product.price}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${product.store.name}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${product.rating} ★</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `
            : ""
        }
      </div>
    `;

    document.body.appendChild(reportContainer);
    return reportContainer;
  }, [formData, budgetDistribution, recommendations, products]);

  const handleDownload = async () => {
    const reportContainer = generateReport();
    const element = reportContainer.querySelector(
      "#report-content"
    ) as HTMLElement;

    if (!element) {
      console.error("Report content not found");
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const pdf = new jsPDF("p", "mm", "a4");

      // Calculate dimensions to fit the content properly
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add image to first page
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      // Add new pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      pdf.save("home-setup-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      document.body.removeChild(reportContainer);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Home Setup Report",
          text: "Check out my AI-generated home setup plan!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert(
        "Sharing is not supported on this browser. You can copy the URL manually."
      );
    }
  };

  return (
    <div className="px-4 py-6 m-auto">
      <div className="">
        <div className="text-left mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            AI-Powered Report Generation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This phase provides a detailed report summarizing your home setup
            plan, including budget breakdowns, selected furniture & appliances,
            store details, and AI-generated room layouts. The report is
            structured for easy navigation, featuring categorized product lists,
            visual charts, and interactive layouts.
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-8 py-5 rounded-md"
            onClick={handleDownload}>
            <Download className="w-5 h-5" />
            Download Your Report
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="bg-[#0A0F1C] hover:bg-[#1A1F2C] text-white flex items-center gap-2 px-8 py-5 rounded-md"
            onClick={handleShare}>
            <Share2 className="w-5 h-5" />
            Share Your Report
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PhaseFive;
