"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan } from "@/models/plan";
import { useIsMobile } from "@/hooks/use-mobile";
import PricingCard from "@/components/ui/pricing-card";
import { PLANS } from "@/lib/config";

const PricingTable: React.FC = () => {
  const [commitment, setCommitment] = useState<"base" | "trimester" | "yearly">(
    "yearly"
  );
  const isMobile = useIsMobile();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 space-y-16">
      {/* Header with Toggle */}
      <motion.div
        className="text-center space-y-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="space-y-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Prix & abonnements
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Transparence totale. Choisissez votre rythme, commencez par une
            séance d'essai gratuite.
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {isMobile ? (
            <Select
              value={commitment}
              onValueChange={(value) =>
                setCommitment(value as "base" | "trimester" | "yearly")
              }
            >
              <SelectTrigger className="w-full max-w-md h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="base" className="text-base cursor-pointer">
                  Sans engagement
                </SelectItem>
                <SelectItem
                  value="trimester"
                  className="text-base cursor-pointer"
                >
                  Engagement 3 mois
                </SelectItem>
                <SelectItem value="yearly" className="text-base cursor-pointer">
                  <div className="flex items-center gap-2">
                    Engagement 12 mois
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                      Économisez 35%
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Tabs
              value={commitment}
              onValueChange={(value) =>
                setCommitment(value as "base" | "trimester" | "yearly")
              }
            >
              <TabsList className="flex w-full h-12 cursor-pointer">
                <TabsTrigger
                  value="base"
                  className="text-base font-medium cursor-pointer flex-1 px-3"
                >
                  Sans engagement
                </TabsTrigger>
                <TabsTrigger
                  value="trimester"
                  className="text-base font-medium cursor-pointer flex-1 px-3"
                >
                  Engagement 3 mois
                </TabsTrigger>
                <TabsTrigger
                  value="yearly"
                  className="text-base font-medium flex items-center gap-2 cursor-pointer flex-1 px-3"
                >
                  Engagement 12 mois
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                    Économisez 35%
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </motion.div>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {PLANS.map((plan, index) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            index={index}
            commitment={commitment}
            cardVariants={cardVariants}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default PricingTable;
