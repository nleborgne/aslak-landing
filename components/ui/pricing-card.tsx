"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"
import { Plan } from "@/models/plan"

interface AnimatedDigitProps {
  digit: string
  index: number
}

// Individual Digit Animation Component
const AnimatedDigit: React.FC<AnimatedDigitProps> = ({ digit, index }) => {
  return (
    <div className="relative overflow-hidden inline-block min-w-[1ch] text-center">
      <motion.span
        key={digit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.05,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="block"
      >
        {digit}
      </motion.span>
    </div>
  )
}

// Scrolling Number Component with individual digit animations
const ScrollingNumber: React.FC<{ value: number }> = ({ value }) => {
  const numberString = value.toString()

  return (
    <div className="flex items-center">
      {numberString.split('').map((digit, index) => (
        <AnimatedDigit
          key={`${value}-${index}`}
          digit={digit}
          index={index}
        />
      ))}
    </div>
  )
}

interface PricingCardProps {
  plan: Plan
  index: number
  commitment: 'base' | 'trimester' | 'yearly'
  cardVariants: {
    hidden: {
      opacity: number
      y: number
      scale: number
    }
    visible: {
      opacity: number
      y: number
      scale: number
    }
  }
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, index, commitment, cardVariants }) => {
  // Simple check icon for all features
  const getFeatureIcon = () => {
    return <Check className="size-3 text-primary" />
  }

  return (
    <motion.div
      key={plan.name}
      variants={cardVariants}
      className="relative"
    >
      {/* Featured Badge */}
      {plan.isFeatured && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg shadow-primary/20">
            <Star className="size-3 fill-current" />
            Meilleur choix
          </div>
        </motion.div>
      )}

      <div className={`
        relative h-full p-8 rounded-xl border-2 transition-all duration-300
        ${plan.isFeatured
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
          : 'border-border bg-card'
        }
      `}>
        {/* Plan Header */}
        <div className="text-center space-y-4 mb-8">
          <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
          <p className="text-muted-foreground">{plan.description}</p>

          {/* Animated Price with Scrolling Numbers */}
          <div className="space-y-2">
            <div className="text-4xl font-bold text-foreground flex items-center justify-center">
              <ScrollingNumber value={commitment !== "base" ? Math.round(plan.price[commitment]) : plan.price.base} /> €
              {plan.billing === "monthly" && <span className="text-lg text-muted-foreground font-normal ml-1">
                / mois
              </span>}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground flex items-center justify-center gap-2"
            >
              {commitment !== "base" && plan.billing === "monthly" && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium"
                >
                  Économisez {(plan.price.base - plan.price[commitment])} €
                </motion.span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-4 mb-8">
          {plan.features.map((feature, featureIndex) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 + featureIndex * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {getFeatureIcon()}
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        {plan.ctaHref && plan.ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            <Button
              asChild
              variant={plan.isFeatured ? "default" : "secondary"}
              size="lg"
              className="w-full"
            >
              <a href={plan.ctaHref}>
                {plan.ctaText}
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default PricingCard
