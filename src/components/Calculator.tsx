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
  SheetClose
} from "~/components/ui/sheet";
import { HistoryIcon } from "lucide-react";
import { ThemeToggle } from "~/components/ThemeToggle";

export function Calculator() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [lastOperation, setLastOperation] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      if (!containerRef.current?.contains(document.activeElement) && 
          document.activeElement?.tagName !== 'BODY') {
        return;
      }
      
      // Don't capture keyboard events when input fields have focus
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      e.preventDefault();
      
      const key = e.key;
      
      // Map keys to calculator functions
      if (key >= '0' && key <= '9') {
        handleButtonClick(key);
      } else if (key === '.') {
        handleButtonClick('.');
      } else if (key === '+') {
        handleButtonClick('+');
      } else if (key === '-') {
        handleButtonClick('-');
      } else if (key === '*') {
        handleButtonClick('×');
      } else if (key === '/') {
        handleButtonClick('÷');
      } else if (key === '^') {
        handleButtonClick('^');
      } else if (key === '(') {
        handleButtonClick('(');
      } else if (key === ')') {
        handleButtonClick(')');
      } else if (key === 'Enter' || key === '=') {
        handleButtonClick('=');
      } else if (key === 'Backspace') {
        handleButtonClick('←');
      } else if (key === 'Escape' || key === 'Delete') {
        handleButtonClick('C');
      } else if (key === 'p') {
        handleButtonClick('π');
      } else if (key.toLowerCase() === 's') {
        handleButtonClick('sin');
      } else if (key.toLowerCase() === 'c') {
        handleButtonClick('cos');
      } else if (key.toLowerCase() === 't') {
        handleButtonClick('tan');
      } else if (key.toLowerCase() === 'l') {
        handleButtonClick('log');
      } else if (key.toLowerCase() === 'n') {
        handleButtonClick('ln');
      } else if (key.toLowerCase() === 'r') {
        handleButtonClick('sqrt');
      } else if (key.toLowerCase() === 'a') {
        handleButtonClick('ANS');
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Focus the calculator container on mount
    if (containerRef.current) {
      containerRef.current.focus();
    }
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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
      className="flex flex-col gap-4 w-full max-w-md mx-auto p-4 bg-background border rounded-lg shadow-lg transition-colors dark:shadow-xl dark:border-border outline-none" 
      tabIndex={0}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Scientific Calculator</h2>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <HistoryIcon className="size-5" />
                <span className="sr-only">History</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-4">
              <SheetHeader>
                <SheetTitle>Calculation History</SheetTitle>
                <SheetDescription>
                  Your previous calculations
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-3">
                {history.length > 0 ? (
                  history.map((item, index) => (
                    <div 
                      key={index} 
                      className="p-3 rounded-md bg-muted hover:bg-muted/80 cursor-pointer transition-colors dark:text-foreground"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-center py-4">
                    No history yet
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/40 border transition-colors dark:bg-muted/10 dark:border-border">
        <div className="font-mono text-sm text-muted-foreground h-6 overflow-x-auto whitespace-nowrap flex items-center justify-end">
          {lastOperation}
        </div>
        <div className="font-mono text-lg h-10 overflow-x-auto whitespace-nowrap flex items-center justify-end">
          {display || "0"}
        </div>
        <div className="font-mono text-2xl font-semibold h-14 overflow-x-auto whitespace-nowrap flex items-center justify-end">
          {result || "0"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {controlButtons.map((btn) => (
          <Button
            key={btn.value}
            variant={btn.variant}
            onClick={() => handleButtonClick(btn.value)}
            className="text-lg font-medium transition-colors"
          >
            {btn.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {scientificButtons.map((btn) => (
          <Button
            key={btn.value}
            variant="secondary"
            onClick={() => handleButtonClick(btn.value)}
            className="text-sm transition-colors"
          >
            {btn.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {numberButtons.map((btn) => (
          <Button
            key={btn.value}
            variant={btn.value === "=" ? "default" : "outline"}
            onClick={() => handleButtonClick(btn.value)}
            className={cn(
              "text-lg font-medium h-12 transition-colors",
              btn.value === "=" && "bg-primary text-primary-foreground col-span-1"
            )}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
} 