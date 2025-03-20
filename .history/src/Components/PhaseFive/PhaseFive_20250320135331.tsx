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

// Initialize PDFMake
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;

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
    try {
      // Create the document definition
      const docDefinition = {
        content: [
          {
            text: "Home Setup Report",
            style: "header",
            alignment: "center",
            margin: [0, 0, 0, 20],
          },
          // User Requirements Section
          formData
            ? {
                text: "User Requirements",
                style: "subheader",
                margin: [0, 0, 0, 10],
              }
            : null,
          formData
            ? {
                columns: [
                  {
                    width: "*",
                    text: [
                      { text: "Budget: ", bold: true },
                      `$${formData.budget}\n`,
                      { text: "Style Preference: ", bold: true },
                      `${formData.style}\n`,
                      { text: "Area: ", bold: true },
                      `${formData.area} ${formData.areaUnit}\n`,
                      { text: "Location: ", bold: true },
                      formData.location,
                    ],
                  },
                ],
              }
            : null,
          // Budget Distribution Section
          {
            text: "Budget Distribution",
            style: "subheader",
            margin: [0, 20, 0, 10],
          },
          {
            table: {
              headerRows: 1,
              widths: ["*", "auto"],
              body: [
                ["Category", "Amount"],
                ...(
                  budgetDistribution ||
                  fakeRecommendationsData.budgetDistribution
                ).map((item) => [
                  item.name,
                  { text: `${item.value}%`, alignment: "right" },
                ]),
              ],
            },
          },
          // Recommendations Section
          {
            text: "Recommendations by Category",
            style: "subheader",
            margin: [0, 20, 0, 10],
          },
          ...Object.entries(
            recommendations || fakeRecommendationsData.recommendations
          ).map(([category, items]) => [
            {
              text: category,
              style: "categoryHeader",
              margin: [0, 10, 0, 5],
            },
            {
              table: {
                headerRows: 1,
                widths: ["*", "auto", "auto", "*"],
                body: [
                  ["Item", "Price", "Rating", "Description"],
                  ...items.map((item) => [
                    item.title,
                    { text: `${item.price}%`, alignment: "right" },
                    item.rating,
                    item.description,
                  ]),
                ],
              },
            },
          ]),
          // Products Section
          products && products.length > 0
            ? {
                text: "Available Products",
                style: "subheader",
                margin: [0, 20, 0, 10],
              }
            : null,
          products && products.length > 0
            ? {
                table: {
                  headerRows: 1,
                  widths: ["*", "auto", "auto", "auto", "auto"],
                  body: [
                    ["Product", "Category", "Price", "Store", "Rating"],
                    ...products.map((product) => [
                      product.title,
                      product.category,
                      { text: `${product.price}%`, alignment: "right" },
                      product.store.name,
                      product.rating,
                    ]),
                  ],
                },
              }
            : null,
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            color: "#1a1f2c",
          },
          subheader: {
            fontSize: 18,
            bold: true,
            color: "#1a1f2c",
          },
          categoryHeader: {
            fontSize: 16,
            bold: true,
            color: "#4285F4",
          },
        },
        defaultStyle: {
          fontSize: 10,
          color: "#333",
        },
        pageSize: "A4",
        pageMargins: [40, 40, 40, 40],
        footer: function (currentPage: number, pageCount: number) {
          return {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: "center",
            margin: [0, 10, 0, 0],
            fontSize: 8,
            color: "#666",
          };
        },
      };

      // Generate and download the PDF
      pdfMake.createPdf(docDefinition).download("home-setup-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
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
    <div className="px-4  py-6 m-auto flex flex-col">
      <h1 className="text-left text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
        AI-Powered Report Generation
      </h1>
      <div className="flex flex-col flex-1 lg:py-40 md:py-20 py-10 h-full items-center justify-center">
        <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto text-center">
          This phase provides a detailed report summarizing your home setup
          plan, including budget breakdowns, selected furniture & appliances,
          store details, and AI-generated room layouts. The report is structured
          for easy navigation, featuring categorized product lists, visual
          charts, and interactive layouts.
        </p>

        <div className="flex justify-center flex-col md:flex-row gap-4 mt-8">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-10 py-4 rounded-md cursor-pointer"
            onClick={handleDownload}>
            <Download className="w-5 h-5" />
            Download Your Report
          </button>
          <button
            className="bg-heading hover:bg-[#1A1F2C] text-white flex items-center gap-2 px-10 py-4 rounded-md cursor-pointer"
            onClick={handleShare}>
            <Share2 className="w-5 h-5" />
            Share Your Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhaseFive;
