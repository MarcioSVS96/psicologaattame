"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Heart, Loader2 } from "lucide-react"

// Componente auxiliar para campos com opção "Não tenho"
const OptionalField = ({
  label,
  children,
  hasOption,
  setHasOption,
  optionLabel,
}: {
  label: string
  children: React.ReactNode
  hasOption: boolean
  setHasOption: (value: boolean) => void
  optionLabel: string
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {!hasOption && children}
    <div className="flex items-center space-x-2 pt-1">
      <Checkbox id={`option-${label}`} checked={hasOption} onCheckedChange={(checked) => setHasOption(Boolean(checked))} />
      <Label htmlFor={`option-${label}`} className="text-sm font-normal text-gray-600">
        {optionLabel}
      </Label>
    </div>
  </div>
)

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Estado para os campos adicionais
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("")
  const [mainComplaint, setMainComplaint] = useState("")
  const [previousTreatments, setPreviousTreatments] = useState("")
  const [medicalConditions, setMedicalConditions] = useState("")
  const [previousDiagnosis, setPreviousDiagnosis] = useState("")
  const [medicalReferrals, setMedicalReferrals] = useState("")
  const [consentGiven, setConsentGiven] = useState(false)
  const [noMainComplaint, setNoMainComplaint] = useState(false)
  const [noPreviousTreatments, setNoPreviousTreatments] = useState(false)
  const [noMedicalConditions, setNoMedicalConditions] = useState(false)
  const [noPreviousDiagnosis, setNoPreviousDiagnosis] = useState(false)
  const [noMedicalReferrals, setNoMedicalReferrals] = useState(false)
  const [maritalStatus, setMaritalStatus] = useState("")
  const [address, setAddress] = useState("")
  const [hasChildren, setHasChildren] = useState(false)
  const [childrenCount, setChildrenCount] = useState<number | string>("")
  const [sexualOrientation, setSexualOrientation] = useState("")
  const [usesMedication, setUsesMedication] = useState(false)
  const [medicationDetails, setMedicationDetails] = useState("")
  const [isEmployed, setIsEmployed] = useState(false)
  const [profession, setProfession] = useState("")
  const [hasReligion, setHasReligion] = useState(false)
  const [religionName, setReligionName] = useState("")
  const [isPracticingReligion, setIsPracticingReligion] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    // Validação de complexidade da senha
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(formData.password)) {
      setError("A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial (@$!%*?&).")
      setIsLoading(false)
      return
    }

    if (!consentGiven) {
      setError("Você deve aceitar o termo de consentimento para continuar.")
      setIsLoading(false)
      return
    }

    try {
      const profileData = {
        full_name: formData.fullName,
        phone: formData.phone,
        date_of_birth: dateOfBirth,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
        main_complaint: noMainComplaint ? "Não tenho queixa principal" : mainComplaint,
        previous_treatments: noPreviousTreatments ? "Não tenho histórico de tratamentos anteriores" : previousTreatments,
        medical_conditions: noMedicalConditions ? "Não tenho condições médicas relevantes" : medicalConditions,
        previous_diagnosis: noPreviousDiagnosis ? "Não tenho diagnóstico anterior" : previousDiagnosis,
        medical_referrals: noMedicalReferrals ? "Não tenho referências médicas" : medicalReferrals,
        consent_given: consentGiven,
        marital_status: maritalStatus,
        address: address,
        has_children: hasChildren,
        children_count: hasChildren ? Number(childrenCount) : 0,
        sexual_orientation: sexualOrientation,
        uses_medication: usesMedication,
        medication_details: usesMedication ? medicationDetails : null,
        is_employed: isEmployed,
        profession: isEmployed ? profession : null,
        has_religion: hasReligion,
        religion_name: hasReligion ? religionName : null,
        is_practicing_religion: hasReligion ? isPracticingReligion : false,
        role: "patient",
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: profileData,
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro durante o cadastro")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-warm-gray flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:text-turquoise transition-colors"
          >
            <Heart className="h-8 w-8" />
            <span className="text-2xl font-serif font-bold">Beatriz Attame</span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-navy">Criar nova conta</CardTitle>
            <CardDescription>Preencha os dados para se cadastrar como paciente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* --- DADOS BÁSICOS --- */}
              <h3 className="text-lg font-semibold text-navy border-b pb-2">Informações da Conta</h3>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                />
              </div>

              {/* --- DADOS PESSOAIS ADICIONAIS --- */}
              <h3 className="text-lg font-semibold text-navy border-b pb-2 pt-4">Dados Pessoais</h3>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Estado Civil</Label>
                <Input id="maritalStatus" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexualOrientation">Orientação Sexual</Label>
                <Input id="sexualOrientation" value={sexualOrientation} onChange={(e) => setSexualOrientation(e.target.value)} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasChildren" checked={hasChildren} onCheckedChange={(checked) => setHasChildren(Boolean(checked))} />
                  <Label htmlFor="hasChildren">Tem filhos?</Label>
                </div>
                {hasChildren && (
                  <div className="pl-6 pt-2">
                    <Label htmlFor="childrenCount">Quantos?</Label>
                    <Input id="childrenCount" type="number" value={childrenCount} onChange={(e) => setChildrenCount(e.target.value)} min="1" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isEmployed" checked={isEmployed} onCheckedChange={(checked) => setIsEmployed(Boolean(checked))} />
                  <Label htmlFor="isEmployed">Trabalha?</Label>
                </div>
                {isEmployed && (
                  <div className="pl-6 pt-2">
                    <Label htmlFor="profession">Qual a profissão?</Label>
                    <Input id="profession" value={profession} onChange={(e) => setProfession(e.target.value)} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="usesMedication" checked={usesMedication} onCheckedChange={(checked) => setUsesMedication(Boolean(checked))} />
                  <Label htmlFor="usesMedication">Faz uso de drogas/medicação?</Label>
                </div>
                {usesMedication && <Textarea placeholder="Quais?" value={medicationDetails} onChange={(e) => setMedicationDetails(e.target.value)} className="mt-2" />}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasReligion" checked={hasReligion} onCheckedChange={(checked) => setHasReligion(Boolean(checked))} />
                  <Label htmlFor="hasReligion">Tem religião?</Label>
                </div>
                {hasReligion && (
                  <div className="pl-6 pt-2 space-y-4">
                    <div>
                      <Label htmlFor="religionName">Qual?</Label>
                      <Input id="religionName" value={religionName} onChange={(e) => setReligionName(e.target.value)} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isPracticing" checked={isPracticingReligion} onCheckedChange={(checked) => setIsPracticingReligion(Boolean(checked))} />
                      <Label htmlFor="isPracticing">É praticante?</Label>
                    </div>
                  </div>
                )}
              </div>

              {/* --- CONTATO DE EMERGÊNCIA --- */}
              <h3 className="text-lg font-semibold text-navy border-b pb-2 pt-4">Contato de Emergência</h3>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Nome do Contato</Label>
                <Input id="emergencyContactName" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Telefone do Contato</Label>
                <Input id="emergencyContactPhone" type="tel" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} />
              </div>

              {/* --- HISTÓRICO --- */}
              <h3 className="text-lg font-semibold text-navy border-b pb-2 pt-4">Histórico Médico e Psicológico</h3>
              <OptionalField label="Queixa Principal" hasOption={noMainComplaint} setHasOption={setNoMainComplaint} optionLabel="Não tenho queixa principal">
                <Textarea value={mainComplaint} onChange={(e) => setMainComplaint(e.target.value)} />
              </OptionalField>

              <OptionalField label="Histórico de Tratamentos Anteriores" hasOption={noPreviousTreatments} setHasOption={setNoPreviousTreatments} optionLabel="Não tenho histórico de tratamentos anteriores">
                <Textarea value={previousTreatments} onChange={(e) => setPreviousTreatments(e.target.value)} />
              </OptionalField>

              <OptionalField label="Condições Médicas Relevantes" hasOption={noMedicalConditions} setHasOption={setNoMedicalConditions} optionLabel="Não tenho condições médicas relevantes">
                <Textarea value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} />
              </OptionalField>

              <OptionalField label="Diagnóstico Anterior" hasOption={noPreviousDiagnosis} setHasOption={setNoPreviousDiagnosis} optionLabel="Não tenho diagnóstico anterior">
                <Textarea value={previousDiagnosis} onChange={(e) => setPreviousDiagnosis(e.target.value)} />
              </OptionalField>

              <OptionalField label="Referências Médicas" hasOption={noMedicalReferrals} setHasOption={setNoMedicalReferrals} optionLabel="Não tenho referências médicas">
                <Textarea value={medicalReferrals} onChange={(e) => setMedicalReferrals(e.target.value)} />
              </OptionalField>

              {/* --- CONSENTIMENTO --- */}
              <h3 className="text-lg font-semibold text-navy border-b pb-2 pt-4">Autorização e Consentimento</h3>
              <div className="flex items-start space-x-3 rounded-md border p-4">
                <Checkbox id="consent" checked={consentGiven} onCheckedChange={(checked) => setConsentGiven(Boolean(checked))} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="consent">Termo de Consentimento Informado</Label>
                  <p className="text-sm text-muted-foreground">
                    Declaro que li e aceito os termos de serviço e a política de privacidade, consentindo com o tratamento dos meus dados para fins terapêuticos.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-turquoise hover:bg-turquoise/90 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta...</> : "Criar conta"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link href="/auth/login" className="text-turquoise hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
              <Link href="/" className="text-sm text-gray-500 hover:text-navy transition-colors">
                ← Voltar ao site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
