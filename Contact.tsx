import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { company, fullAddress, mapsUrl } from '../data/company';

type Field = 'name' | 'email' | 'phone' | 'subject' | 'message';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status =
  | { type: 'idle' }
  | { type: 'sending' }
  | { type: 'success' }
  | { type: 'mailto' }
  | { type: 'error' };

const EMPTY: Values = { name: '', email: '', phone: '', subject: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d\s()/-]{6,}$/;
const ORDER: Field[] = ['name', 'email', 'phone', 'subject', 'message'];

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = 'Add meg a neved.';
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Adj meg egy érvényes e-mail címet, például nev@ceg.hu.';
  if (values.phone.trim() && !PHONE_RE.test(values.phone.trim())) errors.phone = 'A telefonszám csak számjegyet, szóközt és + jelet tartalmazhat.';
  if (values.message.trim().length < 10) errors.message = 'Írd le pár mondatban, mire van szükséged.';
  return errors;
}

function buildMailto(values: Values): string {
  const subject = values.subject.trim() || 'Ajánlatkérés a weboldalról';
  const body = [
    `Név: ${values.name.trim()}`,
    `E-mail: ${values.email.trim()}`,
    values.phone.trim() ? `Telefon: ${values.phone.trim()}` : '',
    '',
    values.message.trim(),
  ]
    .filter((line, i) => line !== '' || i === 3)
    .join('\n');
  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Contact() {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ type: 'idle' });
  const fieldRefs = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;

  const onChange = (field: Field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = ORDER.find((f) => found[f]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    if (!endpoint) {
      window.location.href = buildMailto(values);
      setStatus({ type: 'mailto' });
      return;
    }

    setStatus({ type: 'sending' });
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus({ type: 'success' });
      setValues(EMPTY);
    } catch {
      setStatus({ type: 'error' });
    }
  };

  const fieldProps = (field: Field) => ({
    id: `${uid}-${field}`,
    name: field,
    value: values[field],
    onChange: onChange(field),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${uid}-${field}-error` : undefined,
  });

  const errorFor = (field: Field) =>
    errors[field] ? (
      <p className="field__error" id={`${uid}-${field}-error`}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <section id="kapcsolat" className="contact" tabIndex={-1} aria-labelledby="kapcsolat-cim">
      <div className="contact__space" aria-hidden="true">
        <span className="contact__floor" />
        <span className="contact__light" />
      </div>
      <div className="contact__inner">
        <header className="contact__head">
          <h2 id="kapcsolat-cim" className="contact__title">
            Készítsük el a következő projekted.
          </h2>
          <span className="cutline" aria-hidden="true" />
          <address className="contact__details">
            <a href={company.phone.href}>{company.phone.display}</a>
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              {fullAddress}
              <span className="visually-hidden"> (térkép új lapon)</span>
            </a>
          </address>
        </header>

        <form className="contact__form" noValidate onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor={`${uid}-name`}>Név</label>
            <input
              {...fieldProps('name')}
              ref={(node) => {
                fieldRefs.current.name = node;
              }}
              type="text"
              autoComplete="name"
              required
            />
            {errorFor('name')}
          </div>
          <div className="field">
            <label htmlFor={`${uid}-email`}>E-mail</label>
            <input
              {...fieldProps('email')}
              ref={(node) => {
                fieldRefs.current.email = node;
              }}
              type="email"
              autoComplete="email"
              inputMode="email"
              required
            />
            {errorFor('email')}
          </div>
          <div className="field">
            <label htmlFor={`${uid}-phone`}>
              Telefonszám <span className="field__optional">(nem kötelező)</span>
            </label>
            <input
              {...fieldProps('phone')}
              ref={(node) => {
                fieldRefs.current.phone = node;
              }}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
            />
            {errorFor('phone')}
          </div>
          <div className="field">
            <label htmlFor={`${uid}-subject`}>
              Tárgy <span className="field__optional">(nem kötelező)</span>
            </label>
            <input
              {...fieldProps('subject')}
              ref={(node) => {
                fieldRefs.current.subject = node;
              }}
              type="text"
            />
          </div>
          <div className="field field--wide">
            <label htmlFor={`${uid}-message`}>Üzenet</label>
            <textarea
              {...fieldProps('message')}
              ref={(node) => {
                fieldRefs.current.message = node;
              }}
              rows={5}
              required
            />
            {errorFor('message')}
          </div>
          <div className="contact__submit">
            <button type="submit" className="button-primary button-primary--large" disabled={status.type === 'sending'}>
              {status.type === 'sending' ? 'Küldés folyamatban' : 'Ajánlatot kérek'}
            </button>
            <p className="contact__status" role="status" aria-live="polite">
              {status.type === 'success' ? 'Az üzenet megérkezett. Hamarosan jelentkezünk.' : null}
              {status.type === 'mailto'
                ? 'Megnyitottuk a levelezőprogramodat a kitöltött üzenettel. Onnan küldd el.'
                : null}
              {status.type === 'error' ? (
                <>
                  Az üzenetet nem sikerült elküldeni. Írj közvetlenül a{' '}
                  <a href={`mailto:${company.email}`}>{company.email}</a> címre, vagy hívj a{' '}
                  <a href={company.phone.href}>{company.phone.display}</a> számon.
                </>
              ) : null}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
