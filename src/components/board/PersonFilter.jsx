import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, User } from "lucide-react";
import { motion } from "framer-motion";

export default function PersonFilter({ items, selectedPeople, onChange, onClose }) {
  // Extract unique people from items
  const allPeople = [...new Set(
    items
      .map(item => item.data?.owner)
      .filter(Boolean)
  )];

  const handlePersonChange = (person, checked) => {
    const newPeople = checked 
      ? [...selectedPeople, person]
      : selectedPeople.filter(p => p !== person);
    onChange(newPeople);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 mt-2 z-50"
    >
      <Card className="w-64 shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-foreground">Filter by Person</CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          {allPeople.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No people assigned yet</p>
            </div>
          ) : (
            allPeople.map((person) => (
              <div key={person} className="flex items-center space-x-2">
                <Checkbox
                  id={`person-${person}`}
                  checked={selectedPeople.includes(person)}
                  onCheckedChange={(checked) => handlePersonChange(person, checked)}
                />
                <label 
                  htmlFor={`person-${person}`}
                  className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-medium">
                      {person.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>{person}</span>
                </label>
              </div>
            ))
          )}
          
          {selectedPeople.length > 0 && (
            <div className="pt-3 border-t border-border">
              <button
                onClick={() => onChange([])}
                className="text-sm text-destructive hover:underline"
              >
                Clear selection
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}