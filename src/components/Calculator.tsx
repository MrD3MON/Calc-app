"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetClose,
} from "~/components/ui/sheet";
import { Github, HistoryIcon } from "lucide-react";
import { ThemeToggle } from "~/components/ThemeToggle";
import { FaGithub } from "react-icons/fa";

export function Calculator() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [lastOperation, setLastOperation] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Function to calculate result
  const calculateResult = (expression: string) => {
    try {
      // Replace special characters with JavaScript math operations
      let processedExpression = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, "Math.PI")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/\^/g, "**");

      const calculatedResult = eval(processedExpression).toString();
      setResult(calculatedResult);
      setLastOperation(`${expression} = ${calculatedResult}`);
      setHistory([`${expression} = ${calculatedResult}`, ...history]);
      return calculatedResult;
    } catch (error) {
      setResult("Error");
      return "Error";
    }
  };

  const handleButtonClick = (value: string) => {
    if (value === "=") {
      calculateResult(display);
    } else if (value === "C") {
      setDisplay("");
      setResult("");
    } else if (value === "←") {
      setDisplay(display.slice(0, -1));
    } else if (value === "ANS") {
      setDisplay(display + result);
    } else {
      setDisplay(display + value);
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process keyboard input when the calculator has focus
      if (
        !containerRef.current?.contains(document.activeElement) &&
        document.activeElement?.tagName !== "BODY"
      ) {
        return;
      }

      // Don't capture keyboard events when input fields have focus
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      e.preventDefault();

      const key = e.key;

      // Map keys to calculator functions
      if (key >= "0" && key <= "9") {
        handleButtonClick(key);
      } else if (key === ".") {
        handleButtonClick(".");
      } else if (key === "+") {
        handleButtonClick("+");
      } else if (key === "-") {
        handleButtonClick("-");
      } else if (key === "*") {
        handleButtonClick("×");
      } else if (key === "/") {
        handleButtonClick("÷");
      } else if (key === "^") {
        handleButtonClick("^");
      } else if (key === "(") {
        handleButtonClick("(");
      } else if (key === ")") {
        handleButtonClick(")");
      } else if (key === "Enter" || key === "=") {
        handleButtonClick("=");
      } else if (key === "Backspace") {
        handleButtonClick("←");
      } else if (key === "Escape" || key === "Delete") {
        handleButtonClick("C");
      } else if (key === "p") {
        handleButtonClick("π");
      } else if (key.toLowerCase() === "s") {
        handleButtonClick("sin");
      } else if (key.toLowerCase() === "c") {
        handleButtonClick("cos");
      } else if (key.toLowerCase() === "t") {
        handleButtonClick("tan");
      } else if (key.toLowerCase() === "l") {
        handleButtonClick("log");
      } else if (key.toLowerCase() === "n") {
        handleButtonClick("ln");
      } else if (key.toLowerCase() === "r") {
        handleButtonClick("sqrt");
      } else if (key.toLowerCase() === "a") {
        handleButtonClick("ANS");
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Focus the calculator container on mount
    if (containerRef.current) {
      containerRef.current.focus();
    }

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [display, result]); // Re-run when display or result changes

  const handleHistoryItemClick = (item: string) => {
    const [expression = ""] = item.split(" = ");
    setDisplay(expression);

    // Close the sheet
    setIsSheetOpen(false);

    // Set focus back to the calculator
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const scientificButtons = [
    { value: "sin", label: "sin" },
    { value: "cos", label: "cos" },
    { value: "tan", label: "tan" },
    { value: "log", label: "log" },
    { value: "ln", label: "ln" },
    { value: "π", label: "π" },
    { value: "sqrt", label: "√" },
    { value: "^", label: "^" },
    { value: "(", label: "(" },
    { value: ")", label: ")" },
  ];

  const numberButtons = [
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "÷", label: "÷" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "×", label: "×" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "-", label: "-" },
    { value: "0", label: "0" },
    { value: ".", label: "." },
    { value: "=", label: "=" },
    { value: "+", label: "+" },
  ];

  const controlButtons = [
    { value: "C", label: "C", variant: "destructive" as const },
    { value: "←", label: "←", variant: "secondary" as const },
    { value: "ANS", label: "ANS", variant: "secondary" as const },
  ];

  return (
    <div
      ref={containerRef}
      className="bg-background dark:border-border mx-auto flex w-full max-w-md flex-col gap-3 rounded-lg border p-3 shadow-lg transition-colors outline-none sm:gap-4 sm:p-4 dark:shadow-xl"
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="mr-1 text-base font-semibold sm:text-lg">
            {isMobile ? "Calculator" : "Scientific Calculator"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <a
              href="https://github.com/MrD3MON"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="size-4 sm:size-5" />
            </a>
          </Button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <HistoryIcon className="size-4 sm:size-5" />
                <span className="sr-only">History</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-4 sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Calculation History</SheetTitle>
                <SheetDescription>Your previous calculations</SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-3">
                {history.length > 0 ? (
                  history.map((item, index) => (
                    <div
                      key={index}
                      className="bg-muted hover:bg-muted/80 dark:text-foreground cursor-pointer rounded-md p-3 text-sm transition-colors sm:text-base"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground py-4 text-center">
                    No history yet
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="bg-muted/40 dark:bg-muted/10 dark:border-border flex flex-col gap-1 rounded-lg border p-2 transition-colors sm:p-3">
        <div className="text-muted-foreground flex h-5 items-center justify-end overflow-x-auto font-mono text-xs whitespace-nowrap sm:h-6 sm:text-sm">
          {lastOperation}
        </div>
        <div className="flex h-8 items-center justify-end overflow-x-auto font-mono text-base whitespace-nowrap sm:h-10 sm:text-lg">
          {display || "0"}
        </div>
        <div className="flex h-12 items-center justify-end overflow-x-auto font-mono text-xl font-semibold whitespace-nowrap sm:h-14 sm:text-2xl">
          {result || "0"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {controlButtons.map((btn) => (
          <Button
            key={btn.value}
            variant={btn.variant}
            onClick={() => handleButtonClick(btn.value)}
            className="h-10 text-base font-medium transition-colors sm:h-12 sm:text-lg"
          >
            {btn.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {scientificButtons.map((btn) => (
          <Button
            key={btn.value}
            variant="secondary"
            onClick={() => handleButtonClick(btn.value)}
            className="h-8 px-1 text-xs transition-colors sm:h-10 sm:px-3 sm:text-sm"
          >
            {btn.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        {numberButtons.map((btn) => (
          <Button
            key={btn.value}
            variant={btn.value === "=" ? "default" : "outline"}
            onClick={() => handleButtonClick(btn.value)}
            className={cn(
              "h-10 text-base font-medium transition-colors sm:h-12 sm:text-lg",
              btn.value === "=" &&
                "bg-primary text-primary-foreground col-span-1",
            )}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
