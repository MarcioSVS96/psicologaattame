"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

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

export default function CompleteProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  // Estado para os campos adicionais
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("")
  const [mainComplaint, setMainComplaint] = useState("")
  const [previousTreatments, setPreviousTreatments] = useState("")
  const [medicalConditions, setMedicalConditions] = useState("")
  const [previousDiagnosis, setPreviousDiagnosis] = useState("")
  const [medicalReferrals, setMedicalReferrals] = useState("")
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

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profile) {
          // Preenche o formulário com dados existentes, se houver
          setDateOfBirth(profile.date_of_birth || "")
          setEmergencyContactName(profile.emergency_contact_name || "")
          setEmergencyContactPhone(profile.emergency_contact_phone || "")
          setMainComplaint(profile.main_complaint || "")
          setPreviousTreatments(profile.previous_treatments || "")
          setMedicalConditions(profile.medical_conditions || "")
          setPreviousDiagnosis(profile.previous_diagnosis || "")
          setMedicalReferrals(profile.medical_referrals || "")
          setMaritalStatus(profile.marital_status || "")
          setAddress(profile.address || "")
          setHasChildren(profile.has_children || false)
          setChildrenCount(profile.children_count || "")
          setSexualOrientation(profile.sexual_orientation || "")
          setUsesMedication(profile.uses_medication || false)
          setMedicationDetails(profile.medication_details || "")
          setIsEmployed(profile.is_employed || false)
          setProfession(profile.profession || "")
          setHasReligion(profile.has_religion || false)
          setReligionName(profile.religion_name || "")
          setIsPracticingReligion(profile.is_practicing_religion || false)
        }
      } else {
        router.push("/auth/login")
      }
      setIsLoading(false)
    }
    fetchProfile()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError("Usuário não autenticado.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const profileData = {
        date_of_birth: dateOfBirth,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
        main_complaint: noMainComplaint ? "Não tenho queixa principal" : mainComplaint,
        previous_treatments: noPreviousTreatments ? "Não tenho histórico de tratamentos anteriores" : previousTreatments,
        medical_conditions: noMedicalConditions ? "Não tenho condições médicas relevantes" : medicalConditions,
        previous_diagnosis: noPreviousDiagnosis ? "Não tenho diagnóstico anterior" : previousDiagnosis,
        medical_referrals: noMedicalReferrals ? "Não tenho referências médicas" : medicalReferrals,
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
      }

      const { error } = await supabase.from("profiles").update(profileData).eq("id", user.id)

      if (error) throw error

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o perfil")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-gray flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-turquoise" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-gray flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-2xl border-0 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-navy">Complete seu Cadastro</CardTitle>
          <CardDescription>
            Precisamos de mais algumas informações para personalizar seu atendimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* --- DADOS PESSOAIS ADICIONAIS --- */}
            <section>
              <h3 className="text-lg font-semibold text-navy border-b pb-2">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                  <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Estado Civil</Label>
                  <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                    <SelectTrigger id="maritalStatus">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                      <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                      <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                      <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                      <SelectItem value="União Estável">União Estável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexualOrientation">Orientação Sexual</Label>
                  <Input id="sexualOrientation" value={sexualOrientation} onChange={(e) => setSexualOrientation(e.target.value)} />
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

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="usesMedication" checked={usesMedication} onCheckedChange={(checked) => setUsesMedication(Boolean(checked))} />
                    <Label htmlFor="usesMedication">Faz uso de drogas/medicação?</Label>
                  </div>
                  {usesMedication && <Textarea placeholder="Quais?" value={medicationDetails} onChange={(e) => setMedicationDetails(e.target.value)} className="mt-2" />}
                </div>
              </div>
            </section>

            {/* --- CONTATO DE EMERGÊNCIA --- */}
            <section>
              <h3 className="text-lg font-semibold text-navy border-b pb-2">Contato de Emergência</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Nome do Contato</Label>
                  <Input id="emergencyContactName" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Telefone do Contato</Label>
                  <Input id="emergencyContactPhone" type="tel" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} />
                </div>
              </div>
            </section>

            {/* --- HISTÓRICO --- */}
            <section>
              <h3 className="text-lg font-semibold text-navy border-b pb-2">Histórico Médico e Psicológico</h3>
              <div className="space-y-6 pt-4">
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
              </div>
            </section>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full bg-turquoise hover:bg-turquoise/90 text-white font-semibold" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Salvar e Continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

