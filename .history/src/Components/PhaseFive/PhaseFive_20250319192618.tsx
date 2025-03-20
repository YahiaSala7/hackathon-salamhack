import React, { useCallback } from "react";
import { Download, Share2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";
import { FormData } from "@/types/formData";
import { Product } from "@/types/product";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PhaseFiveProps {
  formData: FormData | null;
  isFormSubmitted: boolean;
  recommendationsData: {
    budgetDistribution: Array<{ category: string; amount: number }>;
    recommendations: Record<
      string,
      Array<{ name: string; price: number; store: string }>
    >;
  };
  productsData: Product[];
}

function PhaseFive({
  formData,
  isFormSubmitted,
  recommendationsData,
  productsData,
}: PhaseFiveProps) {
  const generateReport = useCallback(() => {
    // Use either submitted data or preview data
    const data = isFormSubmitted
      ? recommendationsData
      : {
          budgetDistribution: [
            { category: "Furniture", amount: 15000 },
            { category: "Appliances", amount: 8000 },
            { category: "Decor", amount: 2000 },
          ],
          recommendations: {
            "Living Room": [
              {
                name: "Modern Sectional Sofa",
                price: 2500,
                store: "Ashley Furniture",
              },
              { name: "Coffee Table", price: 400, store: "IKEA" },
              { name: "LED Smart TV", price: 1200, store: "Best Buy" },
            ],
            Kitchen: [
              { name: "Refrigerator", price: 2800, store: "Home Depot" },
              { name: "Dishwasher", price: 700, store: "Lowes" },
              { name: "Microwave", price: 200, store: "Best Buy" },
            ],
          },
        };

    // Create chart data
    const chartData = {
      labels: data.budgetDistribution.map((item) => item.category),
      datasets: [
        {
          data: data.budgetDistribution.map((item) => item.amount),
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(255, 206, 86, 0.8)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return { data, chartData };
  }, [isFormSubmitted, recommendationsData]);

  const handleDownload = async () => {
    const { data, chartData } = generateReport();
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yOffset = 20;

    // Add title
    pdf.setFontSize(24);
    pdf.text("Home Setup Report", pageWidth / 2, yOffset, { align: "center" });
    yOffset += 20;

    // Add budget distribution section
    pdf.setFontSize(18);
    pdf.text("Budget Distribution", 20, yOffset);
    yOffset += 10;

    // Add budget chart
    const chartContainer = document.createElement("div");
    chartContainer.style.width = "400px";
    chartContainer.style.height = "400px";
    document.body.appendChild(chartContainer);

    const chart = new Pie(chartContainer as any, {
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    const chartCanvas = await html2canvas(chartContainer);
    document.body.removeChild(chartContainer);

    const chartImageData = chartCanvas.toDataURL("image/png");
    pdf.addImage(chartImageData, "PNG", 20, yOffset, 170, 85);
    yOffset += 100;

    // Add recommendations section
    pdf.setFontSize(18);
    pdf.text("Recommendations by Room", 20, yOffset);
    yOffset += 10;

    Object.entries(data.recommendations).forEach(([category, items]) => {
      pdf.setFontSize(14);
      pdf.text(category, 20, yOffset);
      yOffset += 8;

      pdf.setFontSize(12);
      items.forEach((item) => {
        const text = `${item.name} - $${item.price} (${item.store})`;
        pdf.text(text, 30, yOffset);
        yOffset += 6;
      });
      yOffset += 5;
    });

    // Add products section if available
    if (productsData && productsData.length > 0) {
      pdf.addPage();
      yOffset = 20;
      pdf.setFontSize(18);
      pdf.text("Available Products", 20, yOffset);
      yOffset += 10;

      pdf.setFontSize(12);
      productsData.forEach((product) => {
        if (yOffset > 250) {
          pdf.addPage();
          yOffset = 20;
        }
        const text = `${product.title} - $${product.price} (${product.store.name})`;
        pdf.text(text, 20, yOffset);
        yOffset += 6;
      });
    }

    pdf.save("home-setup-report.pdf");
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
      alert(
        "Sharing is not supported on this browser. You can copy the URL manually."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
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
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            onClick={handleDownload}>
            <Download className="w-5 h-5" />
            Download Your Report
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="bg-navy-900 hover:bg-navy-800 text-white flex items-center gap-2"
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
