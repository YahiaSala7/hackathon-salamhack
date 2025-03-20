import React, { useCallback } from "react";
import { Download, Share2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";

function PhaseFive() {
  const generateReport = useCallback(() => {
    const report = {
      budget: {
        total: 25000,
        furniture: 15000,
        appliances: 8000,
        decor: 2000,
      },
      recommendations: [
        {
          category: "Living Room",
          items: [
            {
              name: "Modern Sectional Sofa",
              price: 2500,
              store: "Ashley Furniture",
            },
            { name: "Coffee Table", price: 400, store: "IKEA" },
            { name: "LED Smart TV", price: 1200, store: "Best Buy" },
          ],
        },
        {
          category: "Kitchen",
          items: [
            { name: "Refrigerator", price: 2800, store: "Home Depot" },
            { name: "Dishwasher", price: 700, store: "Lowes" },
            { name: "Microwave", price: 200, store: "Best Buy" },
          ],
        },
      ],
      layout: "AI-generated layout details would go here",
    };
    return report;
  }, []);

  const handleDownload = async () => {
    const report = generateReport();
    const element = document.getElementById("report-content");
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("home-setup-report.pdf");
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

  const report = generateReport();

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

        <div
          id="report-content"
          className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Budget Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Object.entries(report.budget).map(([category, amount]) => (
              <div key={category} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium capitalize">{category}</h3>
                <p className="text-2xl font-bold text-blue-600">${amount}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-6">Recommendations</h2>
          {report.recommendations.map((category) => (
            <div key={category.category} className="mb-8">
              <h3 className="text-xl font-medium mb-4">{category.category}</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Item</th>
                      <th className="text-left py-2">Store</th>
                      <th className="text-right py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item) => (
                      <tr key={item.name}>
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">{item.store}</td>
                        <td className="text-right py-2">${item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
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
