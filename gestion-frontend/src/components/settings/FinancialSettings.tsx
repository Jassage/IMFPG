import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Percent, CreditCard, Plus, X } from "lucide-react";
import { SystemSettings } from "@/types/settings";

interface Props {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
}

export const FinancialSettings = ({ settings, setSettings }: Props) => {
  const addPaymentMethod = () => {
    setSettings({
      ...settings,
      paymentMethods: [...settings.paymentMethods, ""],
    });
  };

  const updatePaymentMethod = (index: number, value: string) => {
    const newMethods = [...settings.paymentMethods];
    newMethods[index] = value;
    setSettings({ ...settings, paymentMethods: newMethods });
  };

  const removePaymentMethod = (index: number) => {
    setSettings({
      ...settings,
      paymentMethods: settings.paymentMethods.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Devise et monnaie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Code devise</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) =>
                  setSettings({ ...settings, currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HTG">HTG - Gourde haïtienne</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="USD">USD - Dollar US</SelectItem>
                  <SelectItem value="GBP">GBP - Livre sterling</SelectItem>
                  <SelectItem value="CAD">CAD - Dollar canadien</SelectItem>
                  <SelectItem value="JPY">JPY - Yen japonais</SelectItem>
                  <SelectItem value="CNY">CNY - Yuan chinois</SelectItem>
                  <SelectItem value="INR">INR - Roupie indienne</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Symbole monnaie</Label>
              <Input
                value={settings.currencySymbol}
                onChange={(e) =>
                  setSettings({ ...settings, currencySymbol: e.target.value })
                }
                placeholder="HTG, €, $..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Frais et taxes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Taux de TCA (%)</Label>
              <Input
                type="number"
                value={settings.taxRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    taxRate: parseFloat(e.target.value),
                  })
                }
                min={0}
                max={100}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label>Pénalité de retard</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-muted-foreground">
                  {settings.currencySymbol}
                </span>
                <Input
                  type="number"
                  value={settings.latePaymentFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      latePaymentFee: parseFloat(e.target.value),
                    })
                  }
                  min={0}
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Méthodes de paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {settings.paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={method}
                  onChange={(e) => updatePaymentMethod(index, e.target.value)}
                  placeholder="Ex: MonCash, NatCash..."
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePaymentMethod(index)}
                  className="text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addPaymentMethod}
              className="w-full mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une méthode de paiement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
