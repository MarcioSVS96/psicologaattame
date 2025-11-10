"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
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

type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  date_of_birth: string | null
  gender: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  main_complaint: string | null
  previous_treatments: string | null
  medical_conditions: string | null
  previous_diagnosis: string | null
  medical_referrals: string | null
  marital_status: string | null
  address: string | null
  has_children: boolean | null
  children_count: number | null
  sexual_orientation: string | null
  uses_medication: boolean | null
  medication_details: string | null
  is_employed: boolean | null
  profession: string | null
  has_religion: boolean | null
  religion_name: string | null
  is_practicing_religion: boolean | null
}

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado para os campos
  const [fullName, setFullName] = useState(profile.full_name ?? "")
  const [phone, setPhone] = useState(profile.phone ?? "")
  const [dateOfBirth, setDateOfBirth] = useState(profile.date_of_birth ?? "")
  const [gender, setGender] = useState(profile.gender ?? "")
  const [emergencyContactName, setEmergencyContactName] = useState(profile.emergency_contact_name ?? "")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(profile.emergency_contact_phone ?? "")
  const [mainComplaint, setMainComplaint] = useState(profile.main_complaint ?? "")
  const [previousTreatments, setPreviousTreatments] = useState(profile.previous_treatments ?? "")
  const [medicalConditions, setMedicalConditions] = useState(profile.medical_conditions ?? "")
  const [previousDiagnosis, setPreviousDiagnosis] = useState(profile.previous_diagnosis ?? "")
  const [medicalReferrals, setMedicalReferrals] = useState(profile.medical_referrals ?? "")
  const [maritalStatus, setMaritalStatus] = useState(profile.marital_status ?? "")
  const [address, setAddress] = useState(profile.address ?? "")
  const [hasChildren, setHasChildren] = useState(profile.has_children ?? false)
  const [childrenCount, setChildrenCount] = useState<number | string>(profile.children_count ?? "")
  const [sexualOrientation, setSexualOrientation] = useState(profile.sexual_orientation ?? "")
  const [usesMedication, setUsesMedication] = useState(profile.uses_medication ?? false)
  const [medicationDetails, setMedicationDetails] = useState(profile.medication_details ?? "")
  const [isEmployed, setIsEmployed] = useState(profile.is_employed ?? false)
  const [profession, setProfession] = useState(profile.profession ?? "")
  const [hasReligion, setHasReligion] = useState(profile.has_religion ?? false)
  const [religionName, setReligionName] = useState(profile.religion_name ?? "")
  const [isPracticingReligion, setIsPracticingReligion] = useState(profile.is_practicing_religion ?? false)

  // Estado para as opções "Não tenho"
  const [noMainComplaint, setNoMainComplaint] = useState(profile.main_complaint === "Não tenho queixa principal")
  const [noPreviousTreatments, setNoPreviousTreatments] = useState(
    profile.previous_treatments === "Não tenho histórico de tratamentos anteriores",
  )
  const [noMedicalConditions, setNoMedicalConditions] = useState(
    profile.medical_conditions === "Não tenho condições médicas relevantes",
  )
  const [noPreviousDiagnosis, setNoPreviousDiagnosis] = useState(profile.previous_diagnosis === "Não tenho diagnóstico anterior")
  const [noMedicalReferrals, setNoMedicalReferrals] = useState(profile.medical_referrals === "Não tenho referências médicas")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        phone,
        date_of_birth: dateOfBirth,
        gender,
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
      }),
    })

    setIsSubmitting(false)

    if (response.ok) {
      toast({
        title: "Sucesso!",
        description: "Seu perfil foi atualizado.",
      })
      router.refresh() // Atualiza os dados na página do dashboard
    } else {
      const errorData = await response.json()
      toast({
        title: "Erro",
        description: errorData.message || "Não foi possível atualizar o perfil.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* --- DADOS PESSOAIS --- */}
      <section>
        <h3 className="text-lg font-semibold text-navy border-b pb-2">Dados Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(XX) XXXXX-XXXX" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
            <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gênero</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender"><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Feminino">Feminino</SelectItem>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Não-binário">Não-binário</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
                <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Estado Civil</Label>
            <Select value={maritalStatus} onValueChange={setMaritalStatus}>
              <SelectTrigger id="maritalStatus"><SelectValue placeholder="Selecione..." /></SelectTrigger>
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
          <OptionalField label="Queixa Principal" hasOption={noMainComplaint} setHasOption={setNoMainComplaint} optionLabel="Não tenho queixa principal"><Textarea value={mainComplaint} onChange={(e) => setMainComplaint(e.target.value)} /></OptionalField>
          <OptionalField label="Histórico de Tratamentos Anteriores" hasOption={noPreviousTreatments} setHasOption={setNoPreviousTreatments} optionLabel="Não tenho histórico de tratamentos anteriores"><Textarea value={previousTreatments} onChange={(e) => setPreviousTreatments(e.target.value)} /></OptionalField>
          <OptionalField label="Condições Médicas Relevantes" hasOption={noMedicalConditions} setHasOption={setNoMedicalConditions} optionLabel="Não tenho condições médicas relevantes"><Textarea value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} /></OptionalField>
          <OptionalField label="Diagnóstico Anterior" hasOption={noPreviousDiagnosis} setHasOption={setNoPreviousDiagnosis} optionLabel="Não tenho diagnóstico anterior"><Textarea value={previousDiagnosis} onChange={(e) => setPreviousDiagnosis(e.target.value)} /></OptionalField>
          <OptionalField label="Referências Médicas" hasOption={noMedicalReferrals} setHasOption={setNoMedicalReferrals} optionLabel="Não tenho referências médicas"><Textarea value={medicalReferrals} onChange={(e) => setMedicalReferrals(e.target.value)} /></OptionalField>
        </div>
      </section>

      <Button type="submit" className="w-full bg-turquoise hover:bg-turquoise/90 text-white" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  )
}
